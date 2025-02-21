package parser

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"time"

	"github.com/nathanberry97/personalWebsite/internal/schema"
)

func GetBlogPosts() []schema.BlogPost {
	postsDir := "web/posts"
	var blogPosts []schema.BlogPost

	files, err := os.ReadDir(postsDir)
	if err != nil {
		log.Fatal(fmt.Sprintf("Failed to read directory %s: %v", postsDir, err))
	}

	for _, file := range files {
		filePath := filepath.Join(postsDir, file.Name())

		file, err := os.Open(filePath)
		if err != nil {
			log.Fatal(fmt.Sprintf("Failed to open file %s: %v", filePath, err))
		}

		defer func() {
			if err := file.Close(); err != nil {
				log.Fatal(fmt.Sprintf("Failed to close file %s: %v", filePath, err))
			}
		}()

		scanner := bufio.NewScanner(file)
		var title, date string
		for i := 1; i <= 3; i++ {
			if !scanner.Scan() {
				break
			}
			if i == 1 {
				title = strings.TrimPrefix(scanner.Text(), "# ")
			}
			if i == 3 {
				date = strings.TrimPrefix(scanner.Text(), "## ")
			}
		}

		parsedDate, err := time.Parse(time.DateOnly, date)
		if err != nil {
			log.Fatal(fmt.Sprintf("Missing title or date in file %s", filePath))
		}

		htmlLink := strings.TrimSuffix(file.Name(), ".md") + ".html"
		htmlLink = "blog" + strings.TrimPrefix(htmlLink, "web/posts")

		blogPosts = append(blogPosts, schema.BlogPost{
			Title:      title,
			Date:       date,
			Link:       htmlLink,
			ParsedDate: parsedDate,
		})
	}

	sort.Slice(blogPosts, func(i, j int) bool {
		return blogPosts[i].ParsedDate.After(blogPosts[j].ParsedDate)
	})

	return blogPosts
}
