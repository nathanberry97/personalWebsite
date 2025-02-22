package main

import (
	"log"
	"os"
	"path/filepath"

	"github.com/nathanberry97/personalWebsite/internal/components"
	"github.com/nathanberry97/personalWebsite/internal/pandoc"
	"github.com/nathanberry97/personalWebsite/internal/parser"
	"github.com/nathanberry97/personalWebsite/internal/schema"
	"github.com/nathanberry97/personalWebsite/internal/scss"
)

func main() {
	// Decare vars
	const buildDir = "build/"
	const name = "Nathan"
	const fullName = name + " Berry"
	const rssDescription = "Recent content for Nathan Berrys's personal blog"
	const companyName = "Zest"
	const companyURL = "https://www.zest.uk.com/"
	const linkedinURL = "https://www.linkedin.com/in/nathan-berry-7b8191115/"
	const githubURL = "https://github.com/nathanberry97"
	const email = "nathanberry97@gmail.com"
	const dns = "https://nathanberry.co.uk"

	// Generate reusable components and Compile SCSS
	hashedCSS, err := scss.CompileSCSS("web/assets/scss/style.scss", filepath.Join(buildDir, "css"))
	if err != nil {
		log.Fatal(err)
	}

	navbar, err := components.Navbar([]schema.NavbarData{
		{Href: "/", Text: "[h] home"},
		{Href: "/blog.html", Text: "[b] blog"},
		{Href: githubURL, Text: "[g] github"},
	})
	if err != nil {
		log.Fatal(err)
	}

	generalMetadata, err := components.Metadata(schema.GetMetadataData(
		hashedCSS,
		fullName,
		[]string{"scrambleHeader.js"},
	))
	if err != nil {
		log.Fatal(err)
	}

	blogPostsMetadata, err := components.Metadata(schema.GetMetadataData(
		hashedCSS,
		fullName,
		[]string{"scrambleHeader.js", "toTop.js"},
	))
	if err != nil {
		log.Fatal(err)
	}

	// Get blog posts
	blogPosts, err := parser.GetBlogPosts()
	if err != nil {
		log.Fatal(err)
	}

	latestPosts, rssPosts := blogPosts, blogPosts

	if len(blogPosts) > 4 {
		latestPosts = latestPosts[:4]
	}
	if len(rssPosts) > 15 {
		rssPosts = rssPosts[:15]
	}

	blogFeed, err := components.Feed(blogPosts)
	if err != nil {
		log.Fatal(err)
	}

	lastestFeed, err := components.Feed(latestPosts)
	if err != nil {
		log.Fatal(err)
	}

	// Create static content
	err = components.Home(
		generalMetadata,
		navbar,
		lastestFeed,
		schema.AboutData{
			Name:        name,
			CompanyName: companyName,
			CompanyURL:  companyURL,
			LinkedinURL: linkedinURL,
			GithubURL:   githubURL,
			Email:       email,
		},
		buildDir,
	)
	if err != nil {
		log.Fatal(err)
	}

	err = components.Blog(generalMetadata, navbar, blogFeed, buildDir)
	if err != nil {
		log.Fatal(err)
	}

	err = components.Error(generalMetadata, navbar, buildDir)
	if err != nil {
		log.Fatal(err)
	}

	err = components.RSSFeed(
		rssPosts,
		schema.RSSFeed{
			Title:       fullName,
			Link:        dns,
			Description: rssDescription,
			AtomLink:    dns + "/feed.xml",
		},
		buildDir,
	)
	if err != nil {
		log.Fatal(err)
	}

	// Create blog posts
	templatePath, err := components.BlogPostTemplate(blogPostsMetadata, navbar, name)
	if err != nil {
		log.Fatal(err)
	}
	defer os.Remove(templatePath)
	pandoc.ConvertMarkdown("./web/posts", filepath.Join(buildDir, "blog"), templatePath)

	log.Println("\nBuild completed successfully!")
}
