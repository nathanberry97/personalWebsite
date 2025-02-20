# Fuzzy Session

### 2024-02-18

```
Forget about automating your job, automate your terminal.
```

For the longest time I've been using tmux and setting aliases to open up my
directories, thinking I was being Speedy Gonzales, but boy was I wrong.
Discovering the Primeagen's
[tmux-sessionizer](https://github.com/ThePrimeagen/.dotfiles/blob/master/bin/.local/scripts/tmux-sessionizer)
script has made me feel like Johnny-come-lately.
Obviously I had to rename my version of the script to tmux-sessioniser, as
being British I like my spellings to be correct.
This blog post is about my implementation of the tmux-sessioniser and how it has
vastly improved my workflow.
Hopefully it will help you too, if not, then I hope you will at least find it
entertaining.

Before we get started, I think it would be best to give a brief overview of what
[fzf](https://github.com/junegunn/fzf) is and why you should give a flying fig
about it.
Fzf is a general-purpose command-line fuzzy finder, which allows you to quickly
search for files and directories.
In other words, it makes you feel like a God amongst mere mortals when sharing
your screen with your colleagues.
Let's be honest that is the only reason we use these tools right?

If you aren't using fzf then you are missing out on a whole new world
of productivity.
I would strongly advise you to check it out and see how it can be implemented
into your workflow.
Here is a [blog post](https://www.redhat.com/sysadmin/fzf-linux-fuzzy-finder)
by RedHat which has a brief overview of fzf and some examples of how it can be
used.

## What is fzf-sessioniser?

![](/images/blog/fuzzySession/fzf-sessioniser.png)

What is fzf-sessioniser you might be thinking? It is a way to
quickly create or switch to a tmux session using fzf.
The script uses fzf to select a directory as seen in the image above, and then
creates a new tmux session or switches to an existing session.

One of my favourite features is that it will create two windows in the tmux
session, one for neovim and the other for the terminal.
This is because before I used the script, I always had to cd into my repo
directory and then create two new windows per session.
It was a bit of a faff.

In the next section, I will break down fzf-sessioniser and explain how it works.
If you are only interested in the full script then you can find it in my
dotfiles repository [here](https://github.com/nathanberry97/dotfiles) within
the tmux directory.

## Overview of fzf-sessioniser

```
selected=$(
    find PATH -mindepth 1 -maxdepth 1 -type d | fzf
)

if [[ -z $selected ]]; then
    exit 0
fi
```

Let's first take a look at the contents in the selectRepo function.
This function uses fzf to select a directory, and then assigns the directory
path to the variable name selected, as seen in the above code snippet.
If you don't select a directory then the script will exit.

Please note that the PATH variable is the directory where you want to
start your search from, i.e. you could set it to something like ~/repos.
Also you can set as many directories as you like in the find command.
Now on to the fun part, the switchSession function.

```
selected_name=$(basename "$selected" | tr . _)
tmux_running=$(pgrep tmux)

if [[ -z $TMUX ]] && [[ -z $tmux_running ]]; then
    createNewSession
    tmux attach-session -t $selected_name
    exit 0
fi

if [[ -z $TMUX ]] && [[ -n $tmux_running ]]; then
    checkIfSessionExists
    tmux attach-session -t $selected_name
    exit 0
fi

if [[ -n $TMUX ]] && [[ -n $tmux_running ]]; then
    checkIfSessionExists
    tmux switch-client -t $selected_name
    exit 0
fi
```

The switchSession function is where the main logic of the script lives.
This function checks if the tmux session exists, if the session exists then it
switches to the session, otherwise it creates a new tmux session.
Let's be honest this script is pretty simple, it gets the job done and is easy
to understand. This helps soydevs like me to understand what is going on.
(Keep your complexity away from me; I can only handle so much.)

```
checkIfSessionExists() {
    if ! tmux has-session -t=$selected_name 2> /dev/null; then
        createNewSession
    fi
}

createNewSession() {
  tmux new-session -d -s $selected_name -c $selected 'nvim .'
  tmux rename-window -t $selected_name:1 'vim'
  tmux new-window -d -n 'terminal' -t $selected_name -c $selected
}
```

Above are the two helper functions that are used in the switchSession function,
they are pretty self-explanatory.
The reason why I like this script as much as I do, is because of the
createNewSession function.
If you look at the code-snippet above, you will see that it opens neovim, and
it then creates a new window for the terminal.
Forget about automating your job, automate your terminal.

## How to use fzf-sessioniser

```
# fzf-sessioniser keybinding neovim
vim.keymap.set('n', '<C-f>', '<cmd>silent !tmux neww tmux-sessioniser<CR>')

# fzf-sessioniser keybinding zsh
bindkey -s ^f "tmux-sessioniser\n"

# fzf-sessioniser keybinding tmux
bind-key -n 'C-f' run-shell "tmux neww ~/.local/bin/tmux-sessioniser"
```

Now that you have the script, you might be wondering how to use it.
I have provided some keybindings for you above, you will need to add these
into your config files.
Personally I like to use the keybinding Ctrl-f to invoke the script, but feel
free to use whatever keybinding you like.

Just to note you will also need to save tmux-sessioniser in your PATH so that
you can call it from your shell. I like to save it in ~/.local/bin but you can
save it wherever you like. If you don't save it in your PATH then you will need
to provide the absolute path to the script within your keybinding.

## Bonus tip: Implementing fzf in neovim

```
-- The following plugins are for fuzz finding
{
    'junegunn/fzf.vim',
    dependencies = {
        'junegunn/fzf',
        dir = '~/.local/share/nvim/lazy/fzf',
        build = './install --all'
    }
},
```

Now that you have the script and the keybindings you can also use fzf in neovim.
I have provided a plugin for you to use in your neovim configuration.
The above is an example of how you could implement it using the lazy plugin
manager.
This will install fzf and fzf.vim for you which is how I have implemented it in
my dotfiles.

I know many of you might already be using telescope or some other fuzzy finder
but I personally like using fzf.vim.
It isn't as feature rich as telescope but I find it works well for my
needs and it's fast.
Also here are some keybindings to use in your neovim configuration.
Just to note for Rg you will need to have
[ripgrep](https://github.com/BurntSushi/ripgrep) installed on your system:

```
-- Leader set to space
vim.g.mapleader = ' '

-- fzf key mappings
vim.keymap.set('n', '<leader>g', ':Rg<CR>')
vim.keymap.set('n', '<leader>f', ':GFiles<CR>')
vim.keymap.set('n', 'ff', ':Files<CR>')
vim.keymap.set('n', 'gs', ':GFiles?<CR>')
```

## Closing thoughts

I hope you have found this blog post useful, and that it has helped you to
improve your developer workflow.
If you aren't interested in using fzf-sessioniser I would still highly recommend
you to check out fzf and see how it can be implemented into your workflow.
