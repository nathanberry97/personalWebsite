# Building your own static blog

## 2025-03-04

```
Out with the old in with the new
```

Recently I rewrote how my website was built and compiled.
Before that it was a mix of all different types of technology dating back to
when I first started my personal site back in 2020.
I remember copying this medium article detailing how to create a landing page
and deploying using GitHub pages, from there it snowballed into adding
new features without much thought; as long as it works right?

My plan was to create an application which produced a static blog where I only
needed to worry about the markdown.
It was inspired by my recent post here:
[go beyond static](./goBeyondStatic.html).
My goal was to create an extendable website, I know you could use something
like [HUGO](https://gohugo.io/) but I liked the idea of writing my own site
generator.

This post is going to cover the following:
why I wanted to revamp my website creation,
how I implemented the current solution,
and my overall thoughts once completing the rewrite.

### Why the rewrite

I know the common saying is to never rewrite your projects, but I guess that
doesn't count towards personal projects, right?
Anyway, the main reason for the rewrite was that I wanted a personal blog
where I only have to focus on writing content.
Plus, I get to create a new post about it; two birds, one stone right?

The goal was simple:

```
* HTML to be written as templates
* Only have to worry about markdown for new posts
* Have a project written in Go
```

The reason for wanting the HTML to be written as templates is that it is easily
extendable.
My blog posts were using a template for [pandoc](https://pandoc.org/) before
but the rest was just plain old HTML.

The second reason was technically resolved already and documented here:
[go beyond static](./goBeyondStatic.html).
As when writing new content I always needed to update the HTML and RSS
feed manually.
But resolving that motivated me to take it one step further,
turning the site into a Go application that generates my blog.

Lastly I quite enjoy writing Go and at my day job we don't have any Go in our
projects.
So I thought it would be a good excuse to create an application in my preferred
language.

### How the current solution works

When planning how I wanted my current solution to work I decided to just use
Go's standard library.
Admittedly I am using [pandoc](https://pandoc.org/) and
[sass](https://sass-lang.com/) to compile my scss and markdown
posts, but I do that using *os/exec* so that is written in Go, right?

The main reason for this is that I prefer only having to keep Go
updated and not worry about the dependencies of imported packages.
Now that is out of the way, let’s go over how the current solution works.

I have a folder *./web/templates* in which I store all my templates for
my HTML files.
They all use a file called *base.tmpl* which allows me to have a common
structure for all HTML files, without needing to rewrite per page.

Which I then use *html/template* to import these templates, which is all
done within *./internal/components*.
The main goal of my components is to create the HTML and save it to a
directory called *./build*, which is then uploaded to my website server.
Here is an example of a function inside of components:

```
package components

import (
	"fmt"
	"html/template"
	"os"
	"path/filepath"
)

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
```

From there I also need to compile my scss and markdown posts, to do this
I am using *os/exec* as this allows you to run command line applications.
I'll cover how the pandoc works in this post, but running scss works more
or less the same way.
The only difference is that I add a hash to my CSS filename to avoid clearing
my browser cache every time I update the page's styling.

When using *os/exec* you can run commands with *exec.Command()* in which
you are able to now run your CLI commands.
For example to run pandoc I use the following:
*exec.Command("pandoc", "-s", inputPath, "--template", templatePath, "-o", outputPath, "--quiet")*.
As you can see it is pretty much straight forward when it comes to running
CLI commands.
Here is the function of how I use pandoc in my blog site:

```
package pandoc

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
)

func ConvertMarkdown(inputDir, outputDir, templatePath string) error {
	files, err := os.ReadDir(inputDir)
	if err != nil {
		return fmt.Errorf("Failed to read directory %s: %v", inputDir, err)
	}

	for _, file := range files {
		if file.IsDir() || filepath.Ext(file.Name()) != ".md" {
			continue
		}

		inputPath := filepath.Join(inputDir, file.Name())
		outputPath := filepath.Join(outputDir, file.Name()[:len(file.Name())-3]+".html")

		cmd := exec.Command("pandoc", "-s", inputPath, "--template", templatePath, "-o", outputPath, "--quiet")
		cmd.Stdout = os.Stdout
		cmd.Stderr = os.Stderr
		if err := cmd.Run(); err != nil {
			return fmt.Errorf("Failed to convert Markdown file %s to HTML: %v", inputPath, err)
		}
		fmt.Println("Converted:", inputPath, "->", outputPath)
	}

	return nil
}
```

There it is, a brief overview of how I've updated my personal blog.
Admittedly there are some things I could improve.
But I think at this moment in time I'm not that concerned, as it is a massive
improvement to how the project worked previously.

### Thoughts now the rewrite is complete

At the moment I am happy with how the solution works.
In terms of the future of this project I think I might add a personal project
section.
But first I need some decent personal projects to add on there, the struggle of
working full time.
If you are interested in the code here is the GitHub link:
[personal blog](https://github.com/nathanberry97/personalWebsite).

Apart from that I think I don't want to add anything else, as I just want a
place online where I can document my personal thoughts without the platform
owning the content I produce.
I like the idea of not being dependant on some random site to share my
posts, admittedly having your own site will have a smaller reach.
But is that a bad thing?
