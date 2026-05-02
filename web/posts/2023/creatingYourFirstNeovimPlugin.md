# Creating your first Neovim plugin

## 2023-12-28

```
Making plugin creation easy even dummies can do it
```

Over the Christmas period I've been doing my yearly review of my neovim config
and getting it ready for the year a head. I know many people like to modify
their config every other second but I like to keep mine as simple as possible.

When reviewing the plugins I had installed one of my more superficial plugins
for tablines has been archived, admittedly it has been archived for a while now.

But it got me thinking how hard could it be to make a plugin for neovim,
especially a simple one like
[tabline.vim](https://github.com/mkitt/tabline.vim).
As it turns out it's not that hard resulting in the creation of
[dumbtab.nvim](https://github.com/nathanberry97/dumbtab.nvim).

Which inspired me to write this post, as a way to help others create their own
plugins for neovim.

### File structure

```
.
├── doc
│   └── example.txt
└── lua
    └── example
        └── init.lua
```

To start with we need to create the file structure for our plugin. In this
example we are creating a plugin called **example**. This is the name that
will be used to require the plugin.

The file structure for a neovim plugin is very simple, it consists of a **doc**
directory and a **lua** directory.

Within the **lua** directory there is a directory for each plugin, in this case
it is **example**. Then within the **example** directory there is an
**init.lua** file.
Lastly the **doc** directory contains a **example.txt** file which is used for
documentation within neovim.

With this file structure in place we can start writing our plugin. When requiring
the plugin we will use the name of the directory within the **lua** directory.
For example if we wanted to require the **example** plugin we would use
_require('example')_.

### Lua

```
local M = {}

M.setup = function()
  vim.keymap.set('n', '<leader>s', function()
    vim.o.spell = not vim.o.spell
  end)
end

return M
```

The **init.lua** file is where the magic happens. In this example we are
creating a function called **setup** which will be called in our config to
enable the plugin.

The local variable **M** is used to store the functions and variables we want
to export from the plugin. M is a common standard in lua standing for module
and is used to export functions and variables from a module, just remember to
return M at the end of the file.

```
require('example').setup()
```

Once you have installed your plugin with your plugin manager of choice you can
then enable it in your config. As the example above shows you can call the
**setup** function to enable the plugin.

This will set the keymap **<leader>s** to toggle spell checking. This function
could be called anything you want, you just need to make sure you call it in
your config with the correct name.

As you can see creating a plugin for neovim can be pretty straight forward.
Before I looked into this I thought it involved sorcery and black magic but it
is actually very simple.

### Documentation

```
INTRODUCTION          *example-introduction*

This is an example plugin for neovim. It is
meant to be used as a template for creating
your own plugins.
```

Now it is time to cover everyone's favourite part of programming, documentation.

When creating a plugin it is important to document it so that other people can
use it. The **example.txt** file is used for this purpose. The first line of
the file is the title of the plugin, this is what will be shown when you run
_help example_ in neovim.

When writing the documentation it is important to use the correct syntax so
that neovim can parse it correctly. The syntax is very similar to markdown
with the addition of some extra syntax.

Such as using tags to create sections within the documentation. As the example
above shows with example-introduction. This is used to create a section within
the documentation, the section name is the text between the asterisks.

### Closing thoughts

Creating a plugin for neovim is very simple and quite rewarding. It is a great
way to learn lua and to contribute to the neovim community.

I hope this post has helped you understand how to create a plugin for neovim.
Feel free to check out
[dumbtab.nvim](https://github.com/nathanberry97/dumbtab.nvim)
the plugin I created which inspired this post.
