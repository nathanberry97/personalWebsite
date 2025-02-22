package components

import (
	"fmt"
	"html/template"
	"os"
	"path/filepath"
	"strings"
	templateRSS "text/template"
	"time"

	"github.com/nathanberry97/personalWebsite/internal/schema"
)

func Home(metadata, navbar, feed template.HTML, about schema.AboutData, buildDir string) error {
	tmpl := template.Must(template.ParseFiles(
		"web/templates/base.tmpl",
		"web/templates/home/home.tmpl",
		"web/templates/home/fragments/about.tmpl",
		"web/templates/home/fragments/blog.tmpl",
		"web/templates/home/fragments/links.tmpl",
	))

	outputPath := filepath.Join(buildDir, "index.html")
	file, err := os.Create(outputPath)
	if err != nil {
		return fmt.Errorf("Failed to create file %s: %v", outputPath, err)
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
		return fmt.Errorf("Failed to execute template %s: %v", "base.tmpl", err)
	}

	fmt.Println("Generated:", outputPath)

	return nil
}

func Blog(metadata, navbar, feed template.HTML, buildDir string) error {
	tmpl := template.Must(template.ParseFiles(
		"web/templates/base.tmpl",
		"web/templates/blog/blog.tmpl",
	))

	outputPath := filepath.Join(buildDir, "blog.html")
	file, err := os.Create(outputPath)
	if err != nil {
		return fmt.Errorf("Failed to create file %s: %v", outputPath, err)
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
		return fmt.Errorf("Failed to execute template %s: %v", "base.tmpl", err)
	}

	fmt.Println("Generated:", outputPath)

	return nil
}

func Error(metadata, navbar template.HTML, buildDir string) error {
	tmpl := template.Must(template.ParseFiles(
		"web/templates/base.tmpl",
		"web/templates/error/error.tmpl",
	))

	outputPath := filepath.Join(buildDir, "error.html")
	file, err := os.Create(outputPath)
	if err != nil {
		return fmt.Errorf("Failed to create file %s: %v", outputPath, err)
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
		return fmt.Errorf("Failed to execute template %s: %v", "base.tmpl", err)
	}

	fmt.Println("Generated:", outputPath)

	return nil
}

func RSSFeed(posts []schema.BlogPost, feedData schema.RSSFeed, buildDir string) error {
	tmpl := templateRSS.Must(templateRSS.ParseFiles("web/templates/feed/feed.xml.tmpl"))

	for _, post := range posts {
		feedData.Items = append(feedData.Items, schema.RSSItem{
			Title:   post.Title,
			Link:    feedData.Link + "/" + post.Link,
			PubDate: post.ParsedDate.Format(time.RFC1123Z),
		})
	}

	outputPath := filepath.Join(buildDir, "feed.xml")
	outputFile, err := os.Create(outputPath)
	if err != nil {
		return fmt.Errorf("Failed to create RSS feed file %s: %v", outputPath, err)
	}
	defer outputFile.Close()

	err = tmpl.Execute(outputFile, feedData)
	if err != nil {
		return fmt.Errorf("Failed to execute RSS feed template for %s: %v", outputPath, err)
	}

	fmt.Println("Generated:", outputPath)

	return nil
}

func Metadata(data schema.MetadataData) (template.HTML, error) {
	tmpl := template.Must(template.ParseFiles("web/templates/general/metadata.tmpl"))

	var sb strings.Builder
	err := tmpl.Execute(&sb, data)
	if err != nil {
		return "", fmt.Errorf("Failed to execute metadata template: %v", err)
	}

	return template.HTML(sb.String()), nil
}

func Navbar(links []schema.NavbarData) (template.HTML, error) {
	tmpl := template.Must(template.ParseFiles("web/templates/general/navbar.tmpl"))

	var sb strings.Builder
	err := tmpl.Execute(&sb, links)
	if err != nil {
		return "", fmt.Errorf("Failed to execute navbar template: %v", err)
	}

	return template.HTML(sb.String()), nil
}

func Feed(posts []schema.BlogPost) (template.HTML, error) {
	tmpl := template.Must(template.ParseFiles("web/templates/feed/feed.tmpl"))

	var sb strings.Builder
	err := tmpl.Execute(&sb, posts)
	if err != nil {
		return "", fmt.Errorf("Failed to execute feed template: %v", err)
	}

	return template.HTML(sb.String()), nil
}

func BlogPostTemplate(metadata, navbar template.HTML, name string) (string, error) {
	tmpl := template.Must(template.ParseFiles(
		"web/templates/base.tmpl",
		"web/templates/blogPost/blogPost.tmpl",
	))

	tmpFile, err := os.CreateTemp("", "blogPost-*.tmpl")
	if err != nil {
		return "", fmt.Errorf("failed to create temporary file for blog post template: %w", err)
	}
	defer tmpFile.Close()

	data := map[string]interface{}{
		"Metadata": metadata,
		"Navbar":   navbar,
		"Name":     name,
	}
	if err := tmpl.Execute(tmpFile, data); err != nil {
		return "", fmt.Errorf("failed to execute blog post template for %s: %w", name, err)
	}

	return tmpFile.Name(), nil
}
