---
title: Updating My Website From My Phone
date: '2020-08-26'
---

I’ve always wanted to have a “What I’m reading”  section on my website. I’ve also wanted it to be possible to update it from my phone, since that’s where I do most of my reading. I’m happy to say I’ve succeeded in putting together a *very* minimalistic pipeline. Here’s a simple overview of how it works:

* I'm reading something I like, and want to feature it on my website
* I pull up the share sheet on my iPhone and trigger the iOS Shortcut I've previously set up;
* This shortcut sends some data to Airtable about the item I'm sharing, plus some details I can add manually, like tags for future organization
* Next, I have a Github Action workflow that runs twice daily to check that Airtable for articles; using Airtable’s API it generates for your tables to get the most recent 10 articles and dump them to a JSON in that repository. 

<details><summary>Click here to see the Github Action</summary>

```
name: Tasker

# Controls when the action will run
on: 
  schedule:
    - cron: 0 */12 * * *

jobs:
  # This workflow contains a single job called "get_rows"
  get_rows:
    runs-on: ubuntu-latest

    # Steps represent a sequence of tasks that will be executed as part of the job
    steps:
    # Step 1: Checks out to another branch to make changes
    - name: Checkout
      uses: actions/checkout@v2
    # Step 2: We have a simple timestamp creator that makes sure we always have a change to make. Otherwise our workflow will't fail when it tries to make a commit with zero changes 
    - name: Create timestamp
      shell: bash
      run: |
        now=$(date -d '+8 hours' '+%F %T') 
        echo "Current time : ${now}" > timestamp.txt
    # Step 3: Calls the Airtable API and copies the output to a file
    - name: Get the rows from the Airtable, copy to file
      shell: bash
      env:
        AIRTABLE_KEY: ${{ secrets.AIRTABLE_KEY }}
      run: |
        curl "https://api.airtable.com/v0/appYYsUDUnkHDLuA5/Table%201?view=Grid%20view" -H "Authorization: Bearer ${AIRTABLE_KEY}" > articles.json
    # Moves the files created in previous steps into the expected folder
    - name: Move to output folder
      run: |
        yes| cp -rf articles.json ./workflow-output/ 
        yes| cp -rf timestamp.txt ./workflow-output/
        rm -rf articles.json
        rm -rf timestamp.txt
    # Adds and commits the files
    - name: Commit files
      run: | 
        git config --local user.email "dengel29@gmail.com"
        git config --local user.name "dengel29"
        git add .
        git commit -m "Workflow job: Add new articles Airtable"
    # Force pushes and merges the changes 
    - name: Push changes
      uses: ad-m/github-push-action@master
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        force: true
```
</details>

* Finally, 11ty uses that JSON as a data source and updates the reading list.

The details of each step are not too complicated, and I find the pieces fit nicely together. It has been 'set it and forget it' since I put it together, and has required zero maintenance.

### Using Airtable and iOS Shortcuts to Prototype Small Ideas
I had this idea kicking around my head for a while since I started playing with iOS Shortcuts. I was surprised to see you could trigger HTTP functions with Shortcuts. I’d used Airtable as a database for some no-code prototypes in the past and immediately thought to use it as a datastore as I worked on some ideas. Shortcuts also look like a good use case for Airtable because Airtable’s API is nice and simple, the speed of reads/writes are not a priority, and I won’t be hitting any rate limits. 

Besides using it as a content-source for a section of this website, I'm using it to track expenses entered through a separate iOS Shortcut, and as a punch-in/punch-out system for freelance work.

### Integrating with 11ty
Excited by the possibilities of Shortcuts, I looked for more complex examples. I was particularly excited when I saw [this post](https://www.averyvine.com/blog/programming/2019/10/04/publishing-to-jekyll-from-ipad-with-shortcuts-and-working-copy) on using Bear to draft and upload blog posts. It's a cool idea, but it relies on a paid version of the app [Working Copy](https://workingcopyapp.com/) to push to a remote repository on Github. I felt that it was unnecessary to bring in paid apps to secure just one part of the pipeline. So I replaced Working Copy with pushing to Airtable and the twice-a-day Github Action workflow to check for updates on that Airtable. 

Knowing that 11ty can pull from remote JSON files as a data source at build time, it was only a small leap to consider storing articles on Airtable and pulling them into a Github repository with a custom Workflow. It would be possible to directly call the Airtable API from Eleventy, but I saw this as an opportunity to get familiar with Github Action workflow files. Another great opportunity to start small.

### Wrapping Up
I’ll share links to the other iOS Shortcuts I’ve mentioned in this article later after I’ve made them shareable. If you haven’t tried them out, they are surprisingly fun to play around with. Tools like Data Jar and Scriptable are being built around them to make them more dynamic and useful. And with the potential to make HTTP requests, they have tons of potential. While I’m really pleased with this project, I know it’s just scratching the surface.

