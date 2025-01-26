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
So that is where I'll begin and by the end of this post will cover all of the
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

When it came to blog.html and index.html I would need to add the following:

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
With the blog.html file just containing all the posts I've created, as you
could imagine this file could get very large.
Who am I kidding I am currently averaging 2.5 posts a year...
Anyway if someone else was writing the content this file could get very large
and even more unpleasant to manage.

With it more or less being the same for the RSS feed too.
Which was to add a new item element for each post, the most annoying
part was always getting the date format correct.
As you can probably tell I wasn't the biggest fan of the process.

## It's going to get easier

## The bliss of automation
