---
title: Using iOS Shortcuts, Airtable, and Github Workflows to Update My Website 
date: 2020-08-26
---

I’ve always wanted to have a “What I’m reading”  section on my website. I’ve  also wanted it to be possible to update it from my phone, since that’s where I do most of my reading. I’m happy to say I’ve succeeded in putting together a little pipeline. Here’s a simple overview of how it works:

* An iOS Shortcut that can be triggered from the share sheet sends some data about the article to a table on Airtable;
* Next, I have a Github Workflow that runs twice daily to check that Airtable for articles; using Airtable’s API it generates for your tables to get the most recent 10 articles and dump them to a JSON in that repository. 
* Finally, 11ty uses that JSON as a remote data source and updates the reading list.

The details of each step are not super interesting, nor are they complicated. They do achieve a low-friction method of updating content on this website, essentially from my phone. For me, this is a really good proof of concept for managing content sections on a personal static site and I think could inspire others to figure out other similar use cases. 

### Using Airtable and iOS Shortcuts to Prototype Small Ideas
I had this idea kicking around my head for a while since I started playing with iOS Shortcuts. I was really surprised to see you could trigger HTTP functions with Shortcuts.  I’d used Airtable as a database for some no-code prototypes in the past and immediately thought to use it as a datastore as I worked on some ideas. Shortcuts also look like a good use case for Airtable because Airtable’s API is nice and simple, the speed of reads/writes not a priority, and I won’t be hitting any rate limits. 

My first idea was simply a Shortcut that figures out when you’ve woken up based on when you’ve reached a certain step count. (You could do this based on “when an alarm is turned off” but if we’re being honest that’s not a good reflection of when I’m truly out of bed). I’ve been using it for a month and now have some interesting data points for myself.  

My next idea was an expense tracker. This one is certainly more practical than the Wake Up Log. This one also writes to Airtable. I’ve tried multiple times to start expense-tracking and this one is by far the most frictionless workflow.

Next was a punch-in/punch-out function which I’m using to track how much time I’m spending on certain projects. The two-step nature of this one required me to use the very simple but very valuable Data Jar app to pass data from step 1 to step 2. I wanted to collect this time-tracking for reflection on how I’m using my time, but also because I’ve used time-tracking for freelancing before and I understand how just knowing  that the clock is running keeps me on task. So far, so good.

### Integrating with 11ty
Excited by the possibilities of Shortcuts, I looked for more complex examples. I was particularly excited when I saw [this post](https://www.averyvine.com/blog/programming/2019/10/04/publishing-to-jekyll-from-ipad-with-shortcuts-and-working-copy) on using Bear to draft and upload blog posts. It was a cool idea, but still relied on a paid version of the app Working Copy just to push to a Github. I felt I could do a bit better than that. 

Knowing that 11ty can pull from remote JSON files as a data source at build time, it was only a small leap to consider storing articles on Airtable and pulling them into a Github repository with a custom Workflow. It would be possible to directly call the Airtable API from Eleventy, but I saw this as an opportunity to get familiar with Github Workflow files. Another great opportunity to start small.

### Wrapping Up
I’ll share links to the other iOS Shortcuts I’ve mentioned in this article later after I’ve made them shareable. If you haven’t tried them out, they are surprisingly fun to play around with. Tools like Data Jar and Scriptable are being built around them to make them more dynamic and useful. And with the potential to make HTTP requests, they have almost limitless potential. While I’m really pleased with this project, I know it’s just scratching the surface.

