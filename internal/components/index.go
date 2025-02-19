package components

import (
	"fmt"
	"html/template"
	"log"
	"os"
	"strings"
	templateRSS "text/template"

	"github.com/nathanberry97/personalWebsite/internal/schema"
)

func Home(metadata, navbar, feed template.HTML, about schema.AboutData) {
	tmpl := template.Must(template.ParseFiles(
		"web/templates/base.tmpl",
		"web/templates/home/home.tmpl",
		"web/templates/home/fragments/about.tmpl",
		"web/templates/home/fragments/blog.tmpl",
		"web/templates/home/fragments/links.tmpl",
	))

	outputPath := "web/static/index.html"
	file, err := os.Create(outputPath)
	if err != nil {
		log.Fatal(err)
	}

	err = tmpl.ExecuteTemplate(
		file,
		"base.tmpl",
		map[string]interface{}{
			"Metadata":    metadata,
			"Navbar":      navbar,
			"Feed":        feed,
			"Name":        about.Name,
			"CompanyName": about.CompanyName,
			"CompanyURL":  about.CompanyURL,
			"LinkedinURL": about.LinkedinURL,
			"GithubURL":   about.GithubURL,
			"Email":       about.Email,
		},
	)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Generated:", outputPath)
}

func Blog(metadata, navbar, feed template.HTML) {
	tmpl := template.Must(template.ParseFiles(
		"web/templates/base.tmpl",
		"web/templates/blog/blog.tmpl",
	))

	outputPath := "web/static/blog.html"
	file, err := os.Create(outputPath)
	if err != nil {
		log.Fatal(err)
	}

	err = tmpl.ExecuteTemplate(
		file,
		"base.tmpl",
		map[string]interface{}{
			"Metadata": metadata,
			"Navbar":   navbar,
			"Feed":     feed,
		},
	)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Generated:", outputPath)
}

func Error(metadata, navbar template.HTML) {
	tmpl := template.Must(template.ParseFiles(
		"web/templates/base.tmpl",
		"web/templates/error/error.tmpl",
	))

	outputPath := "web/static/error.html"
	file, err := os.Create(outputPath)
	if err != nil {
		log.Fatal(err)
	}

	err = tmpl.ExecuteTemplate(
		file,
		"base.tmpl",
		map[string]interface{}{
			"Metadata": metadata,
			"Navbar":   navbar,
		},
	)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Generated:", outputPath)
}

func RSSFeed(posts []schema.BlogPost, feedData schema.RSSFeed) {
	tmpl := templateRSS.Must(templateRSS.ParseFiles("web/templates/feed/feed.xml.tmpl"))

	for _, post := range posts {
		feedData.Items = append(feedData.Items, schema.RSSItem{
			Title:   post.Title,
			Link:    feedData.Link + "/" + post.Link,
			PubDate: post.ParsedDate.Format("Mon, 02 Jan 2006 15:04:05 -0700"),
		})
	}

	outputPath := "web/static/index.xml"
	outputFile, err := os.Create(outputPath)
	if err != nil {
		panic(err)
	}
	defer outputFile.Close()

	err = tmpl.Execute(outputFile, feedData)
	if err != nil {
		panic(err)
	}

	fmt.Println("Generated:", outputPath)
}

func Metadata(data schema.MetadataData) template.HTML {
	tmpl := template.Must(template.ParseFiles("web/templates/general/metadata.tmpl"))

	var sb strings.Builder
	err := tmpl.Execute(&sb, data)
	if err != nil {
		log.Fatal(err)
	}

	return template.HTML(sb.String())
}

func Navbar(links []schema.NavbarData) template.HTML {
	tmpl := template.Must(template.ParseFiles("web/templates/general/navbar.tmpl"))

	var sb strings.Builder
	err := tmpl.Execute(&sb, links)
	if err != nil {
		log.Fatalf("Error executing template: %v", err)
	}

	return template.HTML(sb.String())
}

func Feed(posts []schema.BlogPost) template.HTML {
	tmpl := template.Must(template.ParseFiles("web/templates/feed/feed.tmpl"))

	var sb strings.Builder
	err := tmpl.Execute(&sb, posts)
	if err != nil {
		log.Fatal(err)
	}

	return template.HTML(sb.String())
}

func BlogPostTemplate(metadata, navbar template.HTML, name string) (string, error) {
	tmpl := template.Must(template.ParseFiles(
		"web/templates/base.tmpl",
		"web/templates/blogPost/blogPost.tmpl",
	))

	tmpFile, err := os.CreateTemp("", "blogPost-*.tmpl")
	if err != nil {
		return "", fmt.Errorf("failed to create temp file: %w", err)
	}
	defer tmpFile.Close()

	data := map[string]interface{}{
		"Metadata": metadata,
		"Navbar":   navbar,
		"Name":     name,
	}
	if err := tmpl.Execute(tmpFile, data); err != nil {
		return "", fmt.Errorf("error executing template: %w", err)
	}

	return tmpFile.Name(), nil
}
