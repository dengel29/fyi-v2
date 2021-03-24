---
title: Making Supercuts from Youtube Videos
date: "2021-03-18"
---

This is a little write-up of my little project [supercut.fun](https://supercut.fun).

## Inspiration

I used `videogrep` a few months ago and thought it was great and was shocked by the simplicity of the core feature:

`videogrep` creates supercuts from videos by taking a keyword, scanning the subtitle file associated with the video, and chopping up the video according to the timecodes in filtered subtitles.

There are _way_ more features and options than just that, but that's it in a nutshell. I wondered if I could replicate the core feature and make a web-based version. I made a NodeJS-based proof of concept of the core feature in under a week, then spent the next month on UI and fixing edge cases. Here's a quick write-up, on choices made and lessons learned.

## Scope

I knew no matter how much I decided to limit the scope this had the potential to get beyond me, so I tried to be **very** narrow about the scope:

> make super cuts from YouTube videos and let people download them

And of course, make it usable.

## Critical Tech

With that scope, I identified the technologies I would need to use. The two crucial packages were:

- `ytdl-core` package for downloading YouTube videos
- `fluent-ffmpeg` for cutting up videos

I also drew inspiration from Algolia's [youtube-captions-scraper](https://github.com/algolia/youtube-captions-scraper) for getting the captions/subtitles. With those pieces in place, getting to a proof of concept was shockingly straightforward.

## Other Tech Choices

**Language:** I have been learning and practicing Typescript fundamentals on [executeprogram.com](https://www.executeprogram.com/) and wanted to build a Node server with Typescript.

**Hosting:** The website is hosted on a Digital Ocean Droplet and videos are saved in an S3 bucket.

**Front-end:** The actual site was originally just a plain HTML5 form – I wasn't sure how much I wanted to invest in the front end, so I opted for incremental adoption of Alpine features for some simple reactivity. I really enjoyed it, and will probably reach for it for small, minimally-stateful apps like this.

## Things I learned

1. All websites are just a series of forms. That's a hackneyed joke, but honestly I think the next project I build for myself is going strive to avoid any form elements. I think that's a good creative constraint.
2. WebSockets are a perfectly viable way to communicate to users about long-running processes, but wording those updates are tough.
3. There's often an unofficial API to tap into – in this case, it's YouTube's `get_video_info` API that's used to grab the subtitles, along with other crucial video info.
4. On error messages - there are so many different ways and so many different points this simple 3-step website can fail, from captions not being found to videos being uploaded too recently (and therefore captions not being added yet) to video failures to the various input verification. This project really solidified for me how important it is to know the best way to communicate those errors, and where in the UI you display those errors, and how you gate off further progress. I also learned how _satisfying_ it is to get an error message saying precisely why this video or that step failed.
5. User testing – it's tough to find every way your website can break; it's easier to turn over every stone if you let a few people use it.
6. Guiding feedback – it's tempting to tell people what you do and don't want to hear before you send it to them. I did a bit of that, but later stopped because the unfiltered feedback often held unexpected gems.
7. Receiving feedback — I didn't always receive the feedback as gracefully as I should have. It's important to set ego aside when asking for feedback and take nothing personally. If you respond poorly you risk losing out on future valuable feedback.
8. On UX/UI — From its conception was a functionality-driven project, and aesthetics and user-experience were considered secondarily. I think that didn't bite me in the ass for this project because thankfully there aren't too many UI components, but if I approached a more complex project like this I think I would've ended up regretting it. Special thanks to [Grace Yang](http://thegraceyang.com) for taking time to give broad UX/UI recommendations.
9. Do it live! — one of the first things I did after achieving proof of concept was make it live. Buying a domain as step 1 of a project is a great way to get a little dopamine rush and then do nothing. Buying a domain and then making your crappy side-project live is a great way to push yourself to keep updating and improving.

![An earlier version of supercut.fun](/images/uploads/screen-shot-2021-02-23-at-3.59.37-pm.png "An earlier version of supercut.fun")

[Supercut.fun](http://supercut.fun) in an earlier iteration, circa February 2021

10. Source of inspiration – take an offline program and port it to the web! I saw a tweet about this, Sketch → Figma, Microsoft Word → Docs, and countless others. There are plenty of examples of this working well, and I'm sure there are plenty of other similar opportunities.

Ten lessons learned is enough. There's probably more but these were top of mind.

## Stray Thoughts

There's not much else to say. There are still a bug or two that crop up occasionally and definitely still ways to optimize, but I'm not going to cling to this project until it's perfection. It will get there with regular love and occasional updates. I encourage you to [try it out](https://supercut.fun) and send me your thoughts about it if you have any.
