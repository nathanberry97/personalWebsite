# Go Beyond Static

### 2025-01-26

```
Go Beyond Static: Effortless Blog Automation
```

Recently I had the thought of why don't I blog more.
With the obvious answer coming to me... "Well I would if it wasn't such a pain
to update the HTML files and my RSS feed after I write a post."
Well that is what I like to tell myself anyway.

With that in mind I took it upon myself to take out the friction of writing a
new blog post.
So that is where I'll begin and by the end of this post I will cover all of the
things I used to achieve this now seamless process.

## The wicked HTML process

The issue when writing a blog post was that I would need to manually update the
following files: blog.html, index.html, index.xml.
Obviously on the face of it, it isn't too much work to do.
But it was just another step which had to be completed when creating new
content.
I'll now walk you through the step by step process of what needed to happen
when releasing a new post.
Yeah this next part will probably bore you, apologies in advance.

When it came to blog.html and index.html I would need to insert the following:

```
<p>
  <li>
    <a href="blog/example.html">Example</a>
  </li>
  <span class="date">2025-01-26</span>
</p>
```

While ensuring that I had only the latest 3 posts on the index.html and in the
right order.
The blog.html file just containing all the posts I've created, as you could
imagine this file could get very large.
Who am I kidding I am currently averaging 2.5 posts a year...
Anyway if someone else was writing the content this file could get very large
and even more unpleasant to manage.

With it more or less being the same for the RSS feed too.
Which was to add a new item element for each post, the most annoying
part was always getting the date format correct.
As you can probably tell I wasn't the biggest fan of the process.

## It's going to get easier

This is where I decided to make the process better, I wanted it to be like how
my blog posts are generated to HTML form MD (If you are curious I use
[Pandoc](https://pandoc.org/) to achieve this).
I knew it would only take a few hours to implement this feature, but as all
side projects I just put updating the website off.

When it finally became time to start implementing the automation I knew I
wanted to use [Go](https://go.dev/).
As I quite like programming with Go and thought it would be a great choice for
a CLI application.

From there I look into the how to create templates while using Go, here are the
two packages I decided to use:
[html/template](https://pkg.go.dev/html/template),
[text/template](https://pkg.go.dev/text/template).
You might be thinking why does he need to use two different template packages,
well one is for the RSS feed and the other is for my HTML files.

After I decided what I was going to use it came time to create the program,
there were 3 main components which needed to be completed:

```
* Extracting the data from the MD blog posts
* Updating the HTML and XML to support templates
* Writing the updated files in the static directory
```

The first part was quite straight forward as all I needed to do was extract
the blog name and date from the markdown file.
I create some structs to achieve the data structure, the hardest part of this
section was making sure I was formatting the date correctly for the RSS feed.
Which in reality wasn't anything too complicated.

The next task was to update the files to support the template packages I was
using, I'm just going to cover the HTML files in this post.
So I needed a way to allow me to create a list of blog posts in the HTML files,
which ended up with me adding the following:

```
{{range .}}
<p>
    <li>
        <a href="{{.Link}}">{{.Title}}</a>
    </li>
    <span class="date">{{.Date}}</span>
</p>
{{end}}
```

Going through the above snippet:
{{range .}} denotes the start of the loop template package,
{{.Link}} {{.Title}} {{.Date}} all represent the data which is going to be
inserted,
and {{end}} denotes the end of the range loop.
From that I needed to make sure my structs had a Link, Title, and Date field in
it and it was an array for the range loop.
Once I had all that working all I needed to do was run the execute function
provided by the template package and I was golden!

## The bliss of automation

After I completed the script all I needed to do was update my pipeline to
ensure it complied the HTML and RSS feed, which is pretty straight forward.
Now I have a seamless process of writing my markdown posts and let the
pipelines handle the rest.
I must admit while writing my first blog post after implementing the above
it does feel like a much needed improvement.

If anyone is actually interested in how this all works here is the repo which
stores all this code:
[personal website](https://github.com/nathanberry97/personalWebsite). The files
of interest would be the template directory and script/parseBlogFeed.go.
Anyway I hope you learnt a thing or two, or fount it interesting at the very
least.
