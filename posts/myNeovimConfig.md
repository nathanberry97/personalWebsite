# My Neovim Config

### 2025-02-08

```
My Neovim Config: Plugins, Keybindings, and Tweaks
```

Recently, I realised that I haven't really touch my Neovim configuration in
over a year.
The biggest change I made was removing Copilot from my plugins.
Comparing that to when I started using vim back in 2021 I couldn't help but
update my config daily.
Now that my configuration is somewhat stable, I thought I'd share an overview
of plugins, keybindings, and tweaks I've implemented.
Hopefully, you'll find something useful to implement into your own
configuration.

## Preview

![](../images/blog/myNeovimConfig/neovim.png)

As you can see I think we can agree that I like to keep my configuration
minimal.
I try to keep my plugin count low, currently using 10 excluding dependencies.
For example I'm a fan of using [fzf](https://github.com/junegunn/fzf)
to navigate my files rather than using anything like
[NERDTree](https://github.com/preservim/nerdtree), but if I do
want to manually navigate files I'll just use
[netrw](https://neovim.io/doc/user/pi_netrw.html).

If you aren't interested in reading this post and just want to check out my
dotfiles here is the [repo](https://github.com/nathanberry97/dotfiles),
you'll find all the files relating to my neovim config in the nvim directory.
I'll assume if you haven't ran off you are interested in my opinions,
I'm only going to cover things I think are important else we'll be here all
day.
The topics I am going to cover are: plugins, keybindings, and tweaks.

## Plugins

Before I talk about the plugins I think add the most value to my work flow
here is a list of all the plugins I use:
[git gutter](https://github.com/airblade/vim-gitgutter),
[vim fugitive](https://github.com/tpope/vim-fugitive),
[vim wiki](https://github.com/vimwiki/vimwiki),
[catppuccin](https://github.com/catppuccin/nvim),
[dumbtab](https://github.com/nathanberry97/dumbtab.nvim),
[tmux navigator](https://github.com/christoomey/vim-tmux-navigator),
[fzf.vim](https://github.com/junegunn/fzf.vim),
[mason](https://github.com/williamboman/mason.nvim),
[nvim-cmp](https://github.com/hrsh7th/nvim-cmp),
[treesitter](https://github.com/nvim-treesitter/nvim-treesitter).

From all the plugins I use I would say
[fzf.vim](https://github.com/junegunn/fzf.vim),
[mason](https://github.com/williamboman/mason.nvim), and
[nvim-cmp](https://github.com/hrsh7th/nvim-cmp),
are the most important to my workflow.
So I am going to only cover those 3 in this section, that doesn't mean I think
the other plugins aren't worth talking about.
Just that they don't help as much as getting me into the flow state, plus I'm
not trying to make this post into an essay...

Let's begin with [fzf.vim](https://github.com/junegunn/fzf.vim).
Before I start some of you may be wondering why don't I use
[telescope](https://github.com/nvim-telescope/telescope.nvim)
I have tried it out, but I fount that
[fzf](https://github.com/junegunn/fzf)
felt faster when using.
Admittedly, this was back in 2023, so take it with a grain of salt.

I really think people should use some sort of fuzzy finding in there work flow,
nothing is more painful than seeing someone struggle to find a file.
For me I feel that [fzf.vim](https://github.com/junegunn/fzf.vim) helps to add
this feature into neovim, I know a lot of neovim purist would be disgusted that
the plugin is written in vim script.
But I feel like it just works and it works well, but if you prefer some other
fuzzy finding tool use that; all I recommend is you use fuzzy finding as it is
a massive productivity boost.

Now if you do decide to use [fzf.vim](https://github.com/junegunn/fzf.vim)
there are some cli tools I recommend installing which are:
[fzf](https://github.com/junegunn/fzf),
[ripgrep](https://github.com/BurntSushi/ripgrep).
The reason for both of the cli tools are:
[fzf](https://github.com/junegunn/fzf) allows me to search over my files,
while [ripgrep](https://github.com/BurntSushi/ripgrep) allows me to search
inside of my files.
I find this combo to me more than enough for me, here are the keybindings I use
with [fzf.vim](https://github.com/junegunn/fzf.vim) to get it all working in my
config:

```
-- fzf key mappings
vim.keymap.set('n', '<leader>g', ':Rg<CR>')
vim.keymap.set('n', '<leader>f', ':GFiles<CR>')
vim.keymap.set('n', 'ff', ':Files<CR>')
vim.keymap.set('n', 'gs', ':GFiles?<CR>')
```

The next plugin I use daily is
[mason](https://github.com/williamboman/mason.nvim)
which is how I manage my LSPs which makes it pretty straight forward.
With [mason](https://github.com/williamboman/mason.nvim) here are the
dependencies I install to make it all work:
[lsp config](https://github.com/neovim/nvim-lspconfig),
[mason lsp config](https://github.com/williamboman/mason-lspconfig.nvim).
I find this setup pretty easy to manage and have been very happy using
since migrating over from
[Conquer of Completion](https://github.com/neoclide/coc.nvim).

If you aren't using neovim and just vim I would recommend checking out
[Conquer of Completion](https://github.com/neoclide/coc.nvim), as coding
without an LSP is pretty painful I find.
With my lsp I keep the keybindings quite minimal, with only having the
following set: go to definition, go to references, and hover being setup.
This is what they look like in my config:

```
-- Configure key mappings for LSP
vim.keymap.set('n', 'gd', vim.lsp.buf.definition, {})
vim.keymap.set('n', 'gr', vim.lsp.buf.references, {})
vim.keymap.set('n', 'K', vim.lsp.buf.hover, {})
```

In terms of my setup with the LSP I find using
[nvim-cmp](https://github.com/hrsh7th/nvim-cmp)
makes the whole process feel seamless,
[nvim-cmp](https://github.com/hrsh7th/nvim-cmp)
is a completion engine which enables for autocompletion.
Basically it helps to unlock the full potential of using LSPs in your
config.

If I were to write my config again I would probably only install
[fzf.vim](https://github.com/junegunn/fzf.vim),
[mason](https://github.com/williamboman/mason.nvim), and
[nvim-cmp](https://github.com/hrsh7th/nvim-cmp).
Then only adding other plugins when I hit pain points in my work flow,
as I know it is tempting to install loads of other plugins but I feel
that its only going to slow you down in the long run.

## Keybindings

Now moving on to some of my favourite keybindings I use, just to note I set
space as my leader key because I find this most comfortable.
So with out anything further to do here are some of my favourite bindings I
use:

```
-- Standard key mappings
vim.keymap.set('n', '-', ':Ex<CR>')
vim.keymap.set('n', '<leader>s', function() vim.o.spell = not vim.o.spell end)
vim.keymap.set('n', '<leader>r', [[:%s/<C-r><C-w>//g<Left><Left>]])
vim.keymap.set('n', '<C-f>', '<cmd>silent !tmux neww tmux-sessioniser<CR>')
```

The first keybinding I use is setting hyphen to get me into
[netrw](https://neovim.io/doc/user/pi_netrw.html),
this is when I don't use
[fzf.vim](https://github.com/junegunn/fzf.vim) to navigate the file system.

I set leader s to toggle spelling on and off, as when I am writing
markdown I like to have a spell checker enabled.
I find this a pretty straight forward solution.
But somehow how I still manage to add typos...

Next we come on to how I do find and replace in a file which is set to leader
r, it is pretty useful to be fair.
Now I don't need to remember the command for find and replace.
I used to forget it all the time before I added this binding, blame it on the
brain rot.

Lastly probably my favourite keybinding of them all is Ctrl-f which
then runs a script called tmux-sessioniser, if you are interested in how
this works I wrote a [post](./fzfSession.html) outlining what it is and how
it works.

## Tweaks

Lastly I'm going to cover some tweaks which I think helps to make my neovim
experience a lot better.
These are just some standard settings which I like to set.
I'm only going to highlight a select few, as I'm sure you aren't interested in
every setting I have configured and why.

```
-- Standard settings
vim.o.laststatus = 0
vim.g.netrw_banner = 0
vim.opt.colorcolumn = '80'
vim.opt.clipboard:append("unnamedplus")
```

The first one is to hide the status bar, I know that a lot of people love
having this showing and use
[lualine.nvim](https://github.com/nvim-lualine/lualine.nvim)
to style it.
For me I've always thought this just was unnecessary and not useful,
perhaps it is because I like a cleaner look.

Next because I use
[netrw](https://neovim.io/doc/user/pi_netrw.html)
I set the banner to be off, as it is ugly!
I don't know why they have it on by default, as it kinda reminds be of entering
nano and having all the commands plastered all over the place.

Now I really like having colorcolumn enabled and set to 80 chars.
You might think why would someone want to have a random line down there screen
right? Well there is some thought behind it, basically if my code is
overlapping the line it is a sign I've probably nested too much in one
function.
When this happens it is usually time for a refactor.

Lastly I have probably my favourite setting enabled which is copying directly
to my clipboard.
It makes it very easy and straightforward to copy something from my editor
and paste it in other applications for example.
I feel like this is another setting which should just be enabled by default,
as it is very useful I find.

## Closing thoughts

Now I've gone over some of my favourite features of my neovim config
I hope this has inspired you to create you own configuration or help to improve
your workflow.
If you are interested here is a link to my
[dotfiles](https://github.com/nathanberry97/dotfiles).
I hope you learned a thing or two from some of my favourite features I have
enabled, or at the very least found it an interesting read.
