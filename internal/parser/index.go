package parser

import (
	"bufio"
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
		panic(err)
	}

	for _, file := range files {
		filePath := filepath.Join(postsDir, file.Name())

		file, err := os.Open(filePath)
		if err != nil {
			panic(err)
		}
		defer file.Close()

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
				date = strings.TrimPrefix(scanner.Text(), "### ")
			}
		}

		parsedDate, err := time.Parse(time.DateOnly, date)
		if err != nil {
			panic(err)
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
