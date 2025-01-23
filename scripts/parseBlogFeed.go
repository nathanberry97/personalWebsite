package main

import (
	"bufio"
	"html/template"
	"os"
	"path/filepath"
	"strings"
)

type BlogPost struct {
	Title string
	Link  string
	Date  string
}

func main() {
	blogPosts := getBlogPosts()
	tmpl := template.Must(template.ParseFiles("templates/index.html"))

	outputFile, err := os.Create("scripts/test.html")
	if err != nil {
		panic(err)
	}
	defer outputFile.Close()

	err = tmpl.Execute(outputFile, blogPosts)
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

		htmlLink := strings.TrimSuffix(file.Name(), ".md") + ".html"

		blogPosts = append(blogPosts, BlogPost{
			Title: title,
			Date:  date,
			Link:  htmlLink,
		})
	}

	return blogPosts
}
