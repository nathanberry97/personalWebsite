package parser

import (
	"bufio"
	"fmt"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"time"

	"github.com/nathanberry97/personalWebsite/internal/schema"
)

func GetBlogPosts() ([]schema.BlogPost, error) {
	postsDir := "web/posts"

	if _, err := os.Stat(postsDir); os.IsNotExist(err) {
		return nil, fmt.Errorf("directory %s does not exist", postsDir)
	}

	var blogPosts []schema.BlogPost

	err := filepath.WalkDir(postsDir, func(path string, d os.DirEntry, err error) error {
		if err != nil {
			return err
		}

		if d.IsDir() || filepath.Ext(d.Name()) != ".md" {
			return nil
		}

		f, err := os.Open(path)
		if err != nil {
			return fmt.Errorf("failed to open file %s: %v", path, err)
		}
		defer f.Close()

		scanner := bufio.NewScanner(f)

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
			return fmt.Errorf("missing title or date in file %s", path)
		}

		htmlFile := strings.TrimSuffix(filepath.Base(path), ".md") + ".html"

		blogPosts = append(blogPosts, schema.BlogPost{
			Title:      title,
			Date:       date,
			Link:       "blog/" + htmlFile,
			ParsedDate: parsedDate,
		})

		return nil
	})

	if err != nil {
		return nil, err
	}

	sort.Slice(blogPosts, func(i, j int) bool {
		return blogPosts[i].ParsedDate.After(blogPosts[j].ParsedDate)
	})

	return blogPosts, nil
}
