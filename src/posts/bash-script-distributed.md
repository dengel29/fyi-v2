---
title: 'A Simple Bash Script'
date: '2020-08-10'
---
When doing server maintenance you might find yourself walking back to the same file paths again and again, to, say, check logs or something like that. I found myself doing that recently, and figured a way to make the process a little less laborious was to make a way to quickly add aliases to to any remote server's `.bashrc` from a given folder. Run a command, create an alias, then never have to type out the full path again.

### Inspired by zoxide

I just want to briefly mention that this idea was inspired by a tool I tried called [`zoxide`](https://github.com/ajeetdsouza/zoxide). Which is 

>"...a blazing fast alternative to cd, inspired by z and z.lua. It keeps track of the directories you use most frequently, and uses a ranking algorithm to navigate to the best match." 

Which is really cool! The biggest problem for me was it asked me to change my muscle memory of using my most frequently used command, `cd`, in favor of `z`. I looked at `zoxide` and felt like I could do away with the learning and ranking algorithm and still get what I want by simply making it easier to alias `cd` commands to certain folders. So that's what I did!

### Goals
My goals with this were 
  1. to make the script described above, that can add an alias to cd into the current folder from anywhere.
  2. to package and distribute this script for others to use. Or, at least at first, for myself when I have to futz around on servers.

### Making the script

Things I’ve learned from getting to goal one Goal 1:
* `man` pages are good, but the [`tldr`](https://github.com/tldr-pages/tldr-node-client#configuration) package is better. Community driven examples of shell commands are 100x more useful than the instructions that come with the packages.  Using it also keeps me in the terminal and  away from potential distractions in the browser. (Apparently there's [a rust implementation](https://github.com/dbrgn/tealdeer) that works even faster, but I haven't tried it yet.)

* the `finger` command, returns useful information about the user, including their Shell. 
```shell
Login: dengel         			Name: Dan
Directory: /Users/dengel            	Shell: /bin/zsh
On since Mon Jul 27 13:06 (CST) on console, idle 11 days 3:52 (messages off)
On since Thu Jul 30 10:34 (CST) on ttys000, idle 2:56
On since Mon Jul 27 15:50 (CST) on ttys001, idle 2 days 4:36
On since Fri Aug  7 14:03 (CST) on ttys002
No Mail.
No Plan.
```
* the `cut` command
```shell
Cut out the 2nd and 10th fields of each line, using a semicolon as a delimiter:
    cut -d';' -f2,10
```
This isn't the only way of getting the user's Shell, with `echo $0` perhaps being more reliably available on users' computers. Thankfully this is just a proof of concept and I was determined to [start small](../../notes/starting-small), so I don't plan on covering every edge case for now.

After getting the user's shell name, it’s just a matter of asking for the requested alias and chucking that into the `.*rc` file. I decided not yet to agonize over whether to put it into the `*.rc` or `.aliases` or `.profile`; again, just trying to get to green.

<details><summary>The final bash script looks like this:</summary>

```
#!/bin/bash
echo What should this alias be named?
read varname
  

name=""
# SL=$(finger $USER | grep 'Shell:*' | cut -f3 -d ":")
# name=$(basename $SL);
name=$(basename $SHELL)
shellprofile=""
z="zsh"
b="bash"

# echo $name
if [[ $name == $z ]]
then
echo $name
shellprofile=$HOME/.zshrc
elif [[ $name == $b ]]
then
shellprofile=$HOME/.bashrc
# all other shell checks truncated for brevity's sake
else
echo whomnows
fi

output="'cd $(pwd)'"

echo "alias $varname=$output" >> $shellprofile
echo Restarting your shell to effect the changes
$name
echo Complete! In the future type $varname to cd into this directory.
```
</details>

## Distributing

I decided to distribute with npm because it’s arguably the largest package manager, is platform agnostic, and it’s the one I’m most familiar with.

I used [A guide to creating a NodeJS command-line package | by Rubens Mariuzzo](https://medium.com/netscape/a-guide-to-create-a-nodejs-command-line-package-c2166ad0452e) as a reference and it was a good resource for getting me off the ground. 

## Get the script

I called it `esscut` which is a stupid name and too long for something that should be a shortcut. You *could* get it running 
```
npm install esscut
``` 

but I don't recommend it in it's current form. I've tested it with a friend who uses WSL2 and the `finger` command threw an error, so best to wait for some update before using it. 