package main

import (
	"fmt"
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
	hashedCSS := scss.CompileSCSS("web/assets/scss/style.scss", filepath.Join(buildDir, "css"))

	navbar := components.Navbar([]schema.NavbarData{
		{Href: "/", Text: "[h] home"},
		{Href: "/blog.html", Text: "[b] blog"},
		{Href: githubURL, Text: "[g] github"},
	})

	generalMetadata := components.Metadata(schema.GetMetadataData(
		hashedCSS,
		fullName,
		[]string{"scrambleHeader.js"},
	))

	blogPostsMetadata := components.Metadata(schema.GetMetadataData(
		hashedCSS,
		fullName,
		[]string{"scrambleHeader.js", "toTop.js"},
	))

	// Get blog posts
	blogPosts := parser.GetBlogPosts()
	latestPosts, rssPosts := blogPosts, blogPosts

	if len(blogPosts) > 4 {
		latestPosts = latestPosts[:4]
	}
	if len(rssPosts) > 15 {
		rssPosts = rssPosts[:15]
	}

	// Create static content
	components.Home(
		generalMetadata,
		navbar,
		components.Feed(latestPosts),
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
	components.Blog(generalMetadata, navbar, components.Feed(blogPosts), buildDir)
	components.Error(generalMetadata, navbar, buildDir)

	components.RSSFeed(
		rssPosts,
		schema.RSSFeed{
			Title:       fullName,
			Link:        dns,
			Description: rssDescription,
			AtomLink:    dns + "/feed.xml",
		},
		buildDir,
	)

	// Create blog posts
	templatePath, err := components.BlogPostTemplate(blogPostsMetadata, navbar, name)
	if err != nil {
		log.Fatal(fmt.Sprintf("Failed to generate blog post template for %s: %v", name, err))
	}
	defer os.Remove(templatePath)
	pandoc.ConvertMarkdown("./web/posts", filepath.Join(buildDir, "blog"), templatePath)
}
