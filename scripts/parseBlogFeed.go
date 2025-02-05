package main

import (
	"bufio"
	htmlTemplate "html/template"
	"os"
	"path/filepath"
	"sort"
	"strings"
	textTemplate "text/template"
	"time"
)

type BlogPost struct {
	Title      string
	Link       string
	Date       string
	ParsedDate time.Time
}

type RSSItem struct {
	Title   string
	Link    string
	PubDate string
}

type RSSFeed struct {
	Title       string
	Link        string
	Description string
	AtomLink    string
	Items       []RSSItem
}

func main() {
	blogPosts := getBlogPosts()
	latestPosts := blogPosts
	if len(blogPosts) > 3 {
		latestPosts = latestPosts[:3]
	}

	indexTemplate := htmlTemplate.Must(htmlTemplate.ParseFiles("templates/index.tmpl"))
	blogTemplate := htmlTemplate.Must(htmlTemplate.ParseFiles("templates/blog.tmpl"))
	rssTemplate := textTemplate.Must(textTemplate.ParseFiles("templates/index.xml.tmpl"))

	createHtml("static/index.html", indexTemplate, latestPosts)
	createHtml("static/blog.html", blogTemplate, blogPosts)
	createRss("static/index.xml", rssTemplate, blogPosts)
}

func createHtml(filePath string, tmpl *htmlTemplate.Template, posts []BlogPost) {
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

func createRss(filePath string, tmpl *textTemplate.Template, posts []BlogPost) {
	url := "https://nathanberry.co.uk"
	feed := RSSFeed{
		Title:       "Nathan Berry",
		Link:        url,
		Description: "Recent content for Nathan Berrys's personal blog",
		AtomLink:    url + "/index.xml",
	}

	for _, post := range posts {
		feed.Items = append(feed.Items, RSSItem{
			Title:   post.Title,
			Link:    url + "/" + post.Link,
			PubDate: post.ParsedDate.Format("Mon, 02 Jan 2006 15:04:05 -0700"),
		})
	}

	outputFile, err := os.Create(filePath)
	if err != nil {
		panic(err)
	}
	defer outputFile.Close()

	err = tmpl.Execute(outputFile, feed)
	if err != nil {
		panic(err)
	}
}

func getBlogPosts() []BlogPost {
	postsDir := "posts"
	var blogPosts []BlogPost

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

		parsedDate, err := time.Parse("2006-01-02", date)
		if err != nil {
			panic(err)
		}

		htmlLink := strings.TrimSuffix(file.Name(), ".md") + ".html"
		htmlLink = "blog" + strings.TrimPrefix(htmlLink, "posts")

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
