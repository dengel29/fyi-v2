---
title: A regex that finds a specific string between two other specific strings
examplePic: /images/regex-find-url-example.png
---
[Here’s](https://rubular.com/r/kvFttNgi15825V) a regex to find a string in between two strings. This one works well if
* You know the delimiters, ie the two strings that form the boundary of what you’re looking for;
* You know the string you’re looking for in the middle, ie the search term. That’s going to be the one to match.

It looks like this
```
(?=(?!starting-boundary).*ending-boundary)(search-term)
```

In my case, I was looking for an attribute `url` that would only appear between a specific markup tags for `action-text-attachment`. The regex ended up looking like this

```
(?=(?!action-text-attachment).*<\/action-text-attachment)(url)
```

Really nifty, this is one of the few times I’ve used a regex that I can imagine using it again in the future. 