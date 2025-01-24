package main

import (
	"bufio"
	"html/template"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"time"
)

type BlogPost struct {
	Title      string
	Link       string
	Date       string
	ParsedDate time.Time
}

func main() {
	blogPosts := getBlogPosts()
	latestPosts := blogPosts
	if len(blogPosts) > 3 {
		latestPosts = latestPosts[:3]
	}

	indexTemplate := template.Must(template.ParseFiles("templates/index.html"))
	blogTemplate := template.Must(template.ParseFiles("templates/blog.html"))

	createHtml("static/index.html", indexTemplate, latestPosts)
	createHtml("static/blog.html", blogTemplate, blogPosts)
}

func createHtml(filePath string, tmpl *template.Template, posts []BlogPost) {
	outputFile, err := os.Create(filePath)
	if err != nil {
		panic(err)
	}
	defer outputFile.Close()

	err = tmpl.Execute(outputFile, posts)
	if err != nil {
		panic(err)
	}
}

func getBlogPosts() []BlogPost {
	blogDir := "blog"
	var blogPosts []BlogPost

	files, err := os.ReadDir(blogDir)
	if err != nil {
		panic(err)
	}

	for _, file := range files {
		filePath := filepath.Join(blogDir, file.Name())

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

		parsedDate, err := time.Parse("2006-01-02", date)
		if err != nil {
			panic(err)
		}

		htmlLink := strings.TrimSuffix(file.Name(), ".md") + ".html"

		blogPosts = append(blogPosts, BlogPost{
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
