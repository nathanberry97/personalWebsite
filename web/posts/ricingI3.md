# Ricing i3

## 2026-01-21

```
Saying good bye to Gnome
```

Recently I updated my laptop to Fedora 43 and it broke all the Gnome extensions
which made it usable, basically I had my workflow where it worked like my old i3
setup.
Since it broke it resulted in my computer being unbearable, I know cry me a
river.
But recently I had some spare time due to being ill to dust off my old i3
config and give it a new lease on life.

I am very happy with the results to be fair, it is kinda annoying how lazy I got
which resulted in me stopping using i3 in the first place.
Here is a list of some of the main reasons of why I stopped using it in the
first place: no built in settings management, screen tearing, or a bar displaying
basic information.

I've now fixed these "issues" I've listed above by creating a custom rofi script
to manage settings; it handles bluetooth, network, audio, and powering off my
machine.
Then I configured [picom](https://github.com/yshui/picom)
to stop the screen tearing which use to drive me crazy.
Lastly I setup [polybar](https://github.com/polybar/polybar)
to show my work spaces on the left, time of day in the middle, and on the right
some basic information like my battery percent.
I think it looks pretty decent, here is a preview of the setup:

![](/images/blog/ricingI3/preview.webp)

I must admit I have really enjoyed ricing my config, I think setting up
everything to work how you want to is a great experience.
When using a window manager it feels how computers should just work, when
compared to the average desktop experience.
If you are interested in my current config and setting up something like this
yourself here are my [dotfiles](https://github.com/nathanberry97/dotfiles).
