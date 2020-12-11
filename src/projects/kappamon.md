---
title: "Kappamon"
indexImage: /images/kappamon/index-image.png
indexImageAlt: "Proun 1 D, 1919 (oil on canvas) by El Lissitzky (1890-1941)"
heroImage: /images/kappamon/kappamon_graphic.svg
heroImageAlt: 'The Kappamon homescreen hero image, a smiling robot sitting at a desk ready to livestream'
projectDescription: Fullstack for Streamers
order: 4
projectBrief: Kappmamon is an interactive pixel stream pet for Twitch, Mixer, and other live-streaming services.
skills: 
  - Remote Working
  - Jira
  - Refactoring
tech:
  - Node JS
  - Phaser 3
  - HTML5 Canvas
  - Twitch API
  - Mixer API
  - Web Sockets
role: Front-End Developer
inActionVideo: /images/kappamon/kap-in-action.mp4
startDate: February 2019 
endDate: May 2019
---
## My Role At Kappamon

After 2 years of successfully serving a community of over 1000 livestreamers, Kappamon began looking to upgrade their codebase to accommodate more elements onscreen. At the time I joined Kappamon, streamers were able to have one pet on stream, which could respond to commands in chat: when someone in chat types `!dance`, the pet would dance; when someone types `!song`, the pet would respond with a speech bubble containing the artist and name of the song currently playing (granted the streamer was using Spotify). I was brought on to fix some issues connecting with the Twitch API, build out the same features for Mixer (another livestreaming app), and upgrade the streamer-side code to accommodate more elements on-screen at a time. 

## Background: The Tech Behind Kappamon (and Livestreaming)

<div style="display:flex; align-items:center; justify-content:space-between">
If you're unfamiliar with modern video livestreaming, here's a brief backgrounder on the different pieces that come together to make Kappamon work.

<video src="/images/kappamon/idling.mp4" loop autoplay height="150px"></video>
</div>

### Phaser

> [Phaser](https://phaser.io) is a 2D game framework used for making HTML5 games for desktop and mobile. 

Phaser provides a library for drawing and controlling items with HTML5 canvas and Javascript, specifically providing APIs to assist with game-loops and has a nice ecosystem of related tools helpful for Kappamon like [nineslice](https://github.com/jdotrjs/phaser3-nineslice/) and spritesheet packers.

### Open Broadcaster Software (OBS)

> [Open Broadcaster Software](https://obsproject.com/) is a free and open-source cross-platform streaming and recording program built with Qt and maintained by the OBS Project.

OBS is a tool widely used by livestreamers to superimpose mutliple windows and layers on top of their camera and screen footage.

## How do Phaser + OBS + streaming service work together?

Phaser generates an HTML5 canvas with the Kappamon pet started in a default, usually idling motion. The streamer can then pull that browser page with their Kappamon pet to layer on top of their stream. The canvas background is transparent, allowing the streamer to drag the window containing the HTML5 canvas wherever they please without obstructing their stream.

Websockets are using the official Twitch or Mixer APIs to listen to the chat for certain events (subscriptions, cheers, specific !commands). When these events happen, they'll trigger different controller actions, most of which start animations which have been decided by the streamer in their user dashboard at [Kappamon](https://kappamon.com). The pet will dance, eat food, open a present, respond with a speech bubble, and so on.

!['The Kappamon dashboard'](/images/kappamon/kappamon-triggers.png "The Kappamon dashboard")

## Accomplishments
In the 4 months I worked with Kappamon, I had two major contributions and code which is now running in production and serving Kappamon's users. 

### Hypemeter
Streamers often have donation goals, so Kappamon wanted a meter that could visualize these goals and their progress. I created a meter element that lets streamers set a donation goal and uses Websockets to listen for cheer or donation events. When these events were triggered, the meter would fill. The element reflects amount accumulated and how close the accumulated cheers are to reaching the streamer's goal.

<video src="/images/kappamon/hypemeter.mp4" loop autoplay width="90%" style="justify-content:center"></video>

### Refactor and Upgrade Phaser Code

 In order to have more elements – pets, or the hypemeter – and control them independently, Kappamon's front-end code (internally referred to as "streamer-side") required a thorough refactor. The essence of the refactor was how the Phaser game instance was created: the then-existing code  had a straightforward but inflexible implementation based on Phaser v1. To meet the new requirements, I had to update all Phaser code to v3 to take advantage of the Scene API and refactored the existing code to be a single Scene instead of the entire Game. This allowed for a more composable instantiation of each Phaser game, which could now have multiple sprites or entities to be on-screen at once, interacting with one other. 

## Try Kappamon
<video src="/images/kappamon/kappamon-market.mp4" loop autoplay width="90%" style="justify-content:center"></video>
* Visit the site: [Kappamon](https://kappamon.com/)
* Join the [Discord](https://discord.gg/6nfKQEU) 