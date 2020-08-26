---
title: Friendlier Path
date: '2020-08-10'
---

<details><summary>Normally you can find executables on your path by simply using `echo $PATH` which prints out the information, albeit in a single concatenated string:</summary>

```
Users/dengel/.yarn/bin:/Users/dengel/.config/yarn/global/node_modules/.bin:/Users/dengel/.serverless/bin:/usr/local/opt/postgresql/bin:./bin:/Users/dengel/.rbenv/shims:/usr/local/opt/rbenv/bin:/Users/dengel/.yarn/bin:/Users/dengel/.config/yarn/global/node_modules/.bin:/Users/dengel/.serverless/bin:/usr/local/opt/postgresql/bin:/Users/dengel/.nvm/versions/node/v10.16.0/bin:./bin:/Users/dengel/.rbenv/shims:/usr/local/opt/rbenv/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/share/dotnet:~/.dotnet/tools:/Library/Frameworks/Mono.framework/Versions/Current/Commands:/usr/local/sbin:/usr/local/sbin
```

</details>

You can get a more friendly output with the following command

```
echo $PATH | tr \: \\n
``` 

<details><summary>This will replace the colon delimiter with a newline, printing each executable on the path on a new line.</summary>

```
/Users/dengel/.yarn/bin
/Users/dengel/.config/yarn/global/node_modules/.bin
/Users/dengel/.serverless/bin
/usr/local/opt/postgresql/bin
/Users/dengel/.nvm/versions/node/v10.16.0/bin
./bin
/Users/dengel/.rbenv/shims
/usr/local/opt/rbenv/bin
/usr/local/bin
/usr/bin
/bin
/usr/sbin
/sbin
/usr/local/share/dotnet
~/.dotnet/tools
/Library/Frameworks/Mono.framework/Versions/Current/Commands
/usr/local/sbin
```
</details>

<details><summary>What does `tr` do?</summary>


`tr`:

```
Translate characters: run replacements based on single characters and character sets.

  - Replace all occurrences of a character in a file, and print the result:
    tr find_character replace_character < filename

  - Replace all occurrences of a character from another command's output:
    echo text | tr find_character replace_character

```
</details>