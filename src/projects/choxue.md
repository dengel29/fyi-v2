---
title: "Choxue"
indexImage: /images/cx/cxleague-home.jpg
indexImageAlt: "Home page of the CX League website"
heroImage: /images/cx/cxleague-home.jpg
heroImageAlt: 'Home page of the CX League website'
projectDescription: Product Lead at Sports Startup
order: 1
projectBrief: Choxue is a basketball league on a mission to make sports a part of education in Taipei, with the help of technology.
skills: 
  - Product Management
  - AWS
  - GCP
  - Refactoring
tech:
  - Express
  - Angular 2
  - .NET 
  - C#
role: Lead Developer and Product Lead
# inActionVideo: /images/kappamon/kap-in-action.mp4
startDate: September 2019 
endDate: July 2020
---
## Position: [Utility Player](https://en.wikipedia.org/wiki/Utility_player)

I joined Choxue to assess their digital product after a pivot in their core offering to users. After a shakeup in the product team, I took on the position as Head of Digital Product to build and direct the product. I straddled the roles of manager and engineer, getting buy-in from internal stakeholders as well as fulfilling technical responsibilities in what ended up being a very eventful year.

## About Choxue

When I joined Choxue in late 2019, their mission was "to make sports a part of education". To accomplish this, Choxue created an exclusive Taiwanese high school basketball league in a spirit similar to American high school sports leagues.

The one major barrier to students who want to participate (besides getting the okay from their principal and paying a registration fee) was their transcript: they need a minimum GPA to be placed on their team's roster. This was clearly a promising idea because both Nike and Fubon Bank sponsored the league (and previously Under Armor did as well). 

![The concept for the new logo for Choxue](/images/cx/cho-xue.jpg "The concept for the new logo for Choxue")

In 2017, when Choxue's original platform was built, however, the product was very different. Choxue had built a platform to film and edit sports highlights, inspired by sports-intellgience businesses [Krossover](https://www.crunchbase.com/organization/krossover-intelligence). 

As the first technical hire since their previous engineer had left almost 2 years prior, my first task was to help Choxue decide whether it would be a worthwhile investment to keep putting resources into their highlight platform. 

## Auditing a Legacy System

I spent about one month auditing their legacy system, code base, digital assets, provided a cost-assessment of their AWS resources and gave the CEO my conclusions: while the code could be fixed and dependencies resolved, it would take months to become familiar with the undocumented system without the original developer there. This, coupled with the fact that company's strategy had changed dramatically since the original code was written, convinced me that fixing the old platform would not the best use of resources. I made a convincing case and the old platform was suspended, a notice put out to the few users still uplaoding to it, and a data migration plan was developed to make sure all user data and video highlights were backed up.

I then shifted towards working on some internal as well as customer-facing tools that would expedite laborious processes that otherwise required an inordinate amount of man-hours. 

![The blog feature on the new Choxue league website](/images/cx/cxleague-blog.png "The blog feature on the new Choxue league website")

## Building a Transcript Collection Tool

Collecting and analyzing our users' academic transcripts remained a high priority in Choxue's mission. In Choxue's first season before I joined, operations lost weeks of time sorting, determining students' eligibiility to play, and then contacting each school's team to inform them. 

A transcript collection tool would be core to Choxue’s mission of making sure participants are student-athletes. The system was connected to the roster system, which would flag students with warnings or suspend students with grades that did not pass based on Choxue’s requirements. 

At this point, Choxue had begun working with another sports company that maintained a basketball stats system, and the work I did was integrated into their system which was built on Angular 2 and .NET CORE. I jumped into their codebase, got familiar with Angular 2 and .NET CORE, and built out the following features for transcript collection:
* internationalized UI, 
* custom form validation,
* image upload to Azure blob storage,
* ability to quickly and easily copy records,
* batch saving, updating, and deleting records via API,
* success and error toasts informing status of HTTP,
* authenticate coaches to batch update these records themselves, and had the potential to save dozens if not hundreds of man-hours, 
* multiple db migrations to accommodate new tables and connect to rosters;

After about 3 months, I went from knowing zero Angular 2 or .NET to building out a set of services that connected both. Soon after we finished, there was an internal disagreement between Choxue and the stats company whose system was the base for the features I built. In a few weeks, our CEO had decided to cut ties with this company and refocus on our original platform, discarding the work I had done and leaving us in the middle of our season without a stats recording system.

## Transferring Everything In-House

A sudden decision by the CEO to cut ties with Choxue's stats and service provider gave a short window to strategize for several key issues, including how to manage data from users until a new system was ready. 

![Screenshot of the design for the boxscore element](/images/cx/boxscore-screenshot.png "Screenshot of the design for the boxscore element")

### Creating a Temporary League Website and Data-store
After negotiating the handover of data with the stats company we previously worked with, I created an intermediate data-store with [Airtable](https://airtable.com) and a [website](http://cxleague.com) with Ruby on Rails to display the data. Inputting stats was a challenge, because it took bespoke, real-time systems to keep track of that data, but I was able to make a minimum viable solution with Airtable with relational tables connecting teams, groups, and individuals with formulas to calculate things like shot-percentage. It was a good mock of the previous system.

### Digital Re-Design
In the months leading up to this, we had also been discussing a site redesign with local UX/UI designers. We had their completed design by this time, and I was able to execute their design, which you can see at the [temporary league website](cxleague.com). At this time I also negotiated with and contracted a local UI/UX designer to accommodate new focus and features.

## Reviving the Old Platform

With a temporary solution in place and a home for the on-going basketball league, our CEO wanted to revisit the plan to revive the old platform. The next few months were spent reverse engineering the undocumented ExpressJS APIs, updating outdated social auth, creating a basic CI system with Github and AWS ElasticBeanstalk, and lots of other plumbing. My assessment, when I first joined the company – that this effor would take many long months – proved correct, and while it got to a better state than before, the list of bugs with mysterious causes remained long. 

What's more, I was still unconvinced that the highlight system was critical to the business – in fact, the storage of that much video was one of the biggest tech expenditures, and we were not monetizing it at all. At this point, after months of making my case to our CEO, I had stopped trying to change his mind about reviving the old platform.

![Screenshot of the league view of the games schedule](/images/cx/cxleague-schedule.png "Screenshot of the league view of the games schedule")

After 6 months of refactoring and documenting everything about the platform, it still hadn't gotten to the point where it would be completely user-ready. During this time, I had been interviewing other developers to assist with the task. I interviewed 15 developers over 4 months; 5 very promising ones were sent through to the next interview round with my CEO, and all were rejected. 

## Moving On

When I decided to move on from Choxue, I knew I wanted to leave the digital product in a better place than when I left. I gathered all the notes I had written and everything I learned about the platform and made a knowledge base just for the tech platform: the idiosyncratic API versioning, the CI system, dev and staging environment, pushing to production, and so on. 

I learned so much from plumbing through the code for this platform: it was the remains of a once fast-moving start-up and of course not all best-practices were adhered to. And I learned so much from my CEO as well: when you once had a fast-moving start-up, it's hard to let go of the promise of the original platform; indeed a spark was there, and I see why it was hard to listen to an engineer who wasn't there from the beginning. I take all the things I experienced and learned at Choxue with the mindset to fully embrace and sympathize where people were coming from. And even if I couldn't save that product, I hope it makes me a better engineer and person.

