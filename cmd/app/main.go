package main

import (
	"fmt"
	"os"

	"github.com/nathanberry97/personalWebsite/internal/components"
	"github.com/nathanberry97/personalWebsite/internal/pandoc"
	"github.com/nathanberry97/personalWebsite/internal/parser"
	"github.com/nathanberry97/personalWebsite/internal/schema"
	"github.com/nathanberry97/personalWebsite/internal/scss"
)

func main() {
	/**
	 * Generate reusable components and Compile SCSS
	 */
	hashedCSS := scss.CompileSCSS("web/scss/style.scss", "web/static/css")

	navbar := components.Navbar([]schema.NavbarData{
		{Href: "/", Text: "[h] home"},
		{Href: "/blog.html", Text: "[b] blog"},
		{Href: "https://github.com/nathanberry97", Text: "[g] github"},
	})

	metadata := components.Metadata(schema.MetadataData{
		Title:       "Nathan Berry",
		Description: "Software Engineer passionate about command-line development and technology. Read my blog for insights on tech and life.",
		ThemeColour: "#111016",
		CSSFile:     hashedCSS,
	})

	/**
	 * Get blog posts
	 */
	blogPosts := parser.GetBlogPosts()
	latestPosts, rssPosts := blogPosts, blogPosts

	if len(blogPosts) > 4 {
		latestPosts = latestPosts[:4]
	}
	if len(rssPosts) > 15 {
		rssPosts = rssPosts[:15]
	}

	/**
	 * Create static content
	 */
	components.Home(
		metadata,
		navbar,
		components.Feed(latestPosts),
		schema.AboutData{
			Name:        "Nathan",
			CompanyName: "Zest",
			CompanyURL:  "https://www.zest.uk.com/",
			LinkedinURL: "https://www.linkedin.com/in/nathan-berry-7b8191115/",
			GithubURL:   "https://github.com/nathanberry97",
			Email:       "nathanberry97@gmail.com",
		},
	)
	components.Blog(metadata, navbar, components.Feed(blogPosts))
	components.Error(metadata, navbar)

	url := "https://nathanberry.co.uk"
	components.RSSFeed(
		rssPosts,
		schema.RSSFeed{
			Title:       "Nathan Berry",
			Link:        url,
			Description: "Recent content for Nathan Berrys's personal blog",
			AtomLink:    url + "/index.xml",
		},
	)

	/**
	 * Create blog posts
	 */
	templatePath, err := components.BlogPostTemplate(metadata, navbar, "Nathan")
	if err != nil {
		fmt.Println("Error generating template:", err)
		return
	}
	defer os.Remove(templatePath)
	pandoc.ConvertMarkdown("./web/posts", "./web/static/blog", templatePath)
}
