---
title: "StickerMachine"
indexImage: /images/stickermachine/stickermachine.png
indexImageAlt: "A social image created to share Stickermachine on WeChat"
heroImage: /images/stickermachine/sticker_2.png
heroImageAlt: ''
projectDescription: Ruby on Rails 
order: 5
projectBrief: A WeChat miniprogram to put an infinite sticker library at your fingertips
skills: 
  - Tencent's Miniprogram Approval
  - Side Project Execution
tech:
  - Ruby on Rails
  - Redis
  - WeChat Miniprogram
  - Dokku
role: Back-end
# inActionVideo: /images/kappamon/kap-in-action.mp4
startDate: December 2017 
endDate: December 2019
---
## The Need for a StickerMachine
Me and [Grace Yang](https://thegraceyang.com) had the goal of building an unlimited sticker (GIF) library for WeChat. Stickers at that time had to be purchased or compressed and imported through a laborious desktop process. While WeChat excelled in other aspects, the GIF keyboards of Facebook Messenger and iMessage gave more easy access to adding expressive GIFs to messages. While GIFs or stickers were big part of WeChat culture, there was no simple way to search and find a sticker based on keywords. StickerMachine aimed to fill that gap.

## How we did it
!['A collage of GIFs from StickerMachine searches'](/images/stickermachine/stickermachine-3.png "A collage of GIFs from StickerMachine searches")
Integrating with the Giphy API is easy enough: it's well documented, and we got that up and running in a demo miniprogram in no time. What was difficult was everything that followed. There are strict content restrictions to publishing web content in China, which impacted our release of the miniprogram in two main ways.

The first is that WeChat miniprograms do not allow APIs from non-Chinese servers to serve content to them. So directly calling the Giphy API does not work, unless they had a mirror of their site on a Chinese server, which they do not. This required us to build one ourselves.

The second barrier is content filtering. If there are non-static image resources in your WeChat miniprogram – that is, user uploaded and not auditable when you initially upload the app – you may be subject to reject because you have no implemented a security check on the images. Also, if there is user text input and you are not checking that for inappropriate content, you also may be subject to rejection. 

Thankfully(?), Tencent supplies two separate APIs, a text security check and an image security check. After our first rejection, we decided to first try the text security check to see if that would solve it. Essentially what we do is intercept the search query before sending it to the Giphy API mirror; if the Tencent API deems the term "unsafe", we ask the users to submit a more "safe" or "friendly" query. If it passes, the query term is submitted to the API and they get their results back.

## Accomplishments

Besides the accomplishment of publishing the app despite the aforementioned roadblocks, StickerMachine ended up becoming quite popular, garnering [over 5000 unique visitors](https://www.linkedin.com/pulse/wechat-mini-program-sticker-machine-surpasses-5000-unique-grace-yang/) over its short lifespan. 

### Giphy Integration
I integrated Giphy API to comply with the size and content restrictions defined by WeChat

### Redis Caching
In order to save trips to our production server and avoid hitting our API limit with Giphy, we also set up a Redis server to save popular requests.

### Image And Search Compliance
Implement Tencent's content security API to make sure search terms were harmonious with Chinese law  

## In the end?

In the end, StickerMachine was shut down by Tencent. I have my theories why – it just may have had to do with the image security check not being implemented (text security check might not cut it on an image-heavy application). Although we set the Giphy API settings to be PG-13, some things might have fallen through the cracks. 

We had other ambitions for StickerMachine, but we haven't had time to improve and re-submit it. We decided it was time to focus on other projects and let StickerMachine rest. It was a good learning experience and very exciting to watch people use it. It served its purpose and I'm very proud of what we did with it.