# Personal development environment

## 2025-09-04

```
My personal development environment is better than yours
```

I've come to realise that majority of people I've worked with don't really
care much for their personal development setup, just download vscode and jobs
a goodun.
But I believe people can get a much better experience if they just put a little
more effort into the tools they use.

To be fair I probably spend too much time thinking about the developer tools I
use, and how they work together.
I get neovim isn't for everyone but I'm going to write this posts in hopes
to inspire you on revamping your own development environment.
Here is a current preview of how my setup looks:

![](/images/blog/personalDevelopmentEnvironment/neovimPreview.webp)

### Overview of the tools I use

Here are the main elements of my setup:

```
* alacritty
* neovim
* tmux
* fzf
```

I use alacritty for my terminal emulator but I'm not too precious about this,
I've also used ghostty while on mac which I quite liked.
I just think that in terms of the terminal you use make sure it isn't the stock
one, as I personal find them quite disappointing.
Just to note if you are on windows using wsl I would highly recommend using the
windows terminal, as I find this terminal works best on windows machines.

In terms of how I code I use neovim which I think is probably my favourite
editor I've used to date, I've been using neovim and vim for the past 4 years
and I don't think I could go back.
I really think everyone should try and learn vim motions and enable it in their
editor of choice, for me it makes editing coding feel like a game.
To be honest I struggle quite a bit now if I'm working on anything which
doesn't implement vim motions if I'm being honest.

Then to manage my coding sessions I use tmux as it is quite nice that
I can have a different session per project I may be working on.
My work flow is usually the first pane is for neovim and the second I use for my
terminal.
If I also ever need to run a server I would just create a new pane to handle
this.
You can see how this is setup in the screenshot of my coding environment above.

Lastly I use fzf which is my favourite part about my developer setup, as I have
a script which I modified from the Primeagen.
Whenever I do control f and select a project it will open a pane for neovim
and a terminal.
I find this is a great way to jump between projects, as at my current job
I'm working on around 3 projects concurrently for features.
Plus this is a lot less over head than any other way you could achieve this
I find.
Here is how the script looks when I press control f:

![](/images/blog/personalDevelopmentEnvironment/fzfPreview.webp)

### Other ways to improve you DevEx

Another thing I think is quite important to developer experiences is the
keyboard you use.
For me I find the HHKB a great companion while using vim as the spilt backspace
and control key where caps lock is located on most keyboards is great while
coding from the terminal.
It does make sense considering the keyboard was designed based on UNIX layout
keyboards.
Since using this layout I struggle to use any other type of keyboard if I don't
remap caps lock to control.
If you are curious about the layout here is a picture of my heavy grail which
is an after market housing for the HHKB:

![](/images/blog/personalDevelopmentEnvironment/hhkb.webp)

Along side this I highly recommend being comfortable at touch typing as it helps
a lot with getting in the flow, as before I could touch type needing to look
at my keyboard while typing every few seconds was quite distracting.
I know some people come back with the argument that when they code most of the
time they are thinking, but still if you are on your computer 40 plus hours a
week it will benefit you in the long run learning to touch type.

### Conclusion

While this article just briefly goes over my developer setup I hope it has
made you want to improve your workflow.
It isn't about the tools you use it is about how comfortable you are at
controlling the environment you work in.
Being comfortable at using keyboard shortcuts in your editor of choice, work
at improving your touch typing, and most importantly make sure you are having
fun while doing so.
