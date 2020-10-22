---
title: 'Part 1 Connecting AWS Lambda To A Postgres DB'
date: '2020-10-05'
---

##### I had a simple desire: connect an AWS Lambda to a Postgres relational database, even though it's not completely recommended, based on what I’ve read (I read [this](https://hasura.io/blog/building-stateful-apps-using-serverless-postgres-and-hasura/)). I was motivated to try this because I could imagine a scenario where I wanted to integrate a serverless function into an alread-existing app that utilized a Postgres DB. As things often go, I failed many times and started over just as many before I finally achieved my goal: read and write to a Postgres database in an AWS Lambda. 
---
<details>
<summary>An aside: There are so many options for creating a serverless function, and so many of my failed attempts were at finding the one "framework" that worked for me. Long story short, I picked Serverless Framework. Skip this section if you don't want to read about all the options.</summary>
I won’t walk through all the failures, but I do want to briefly note that the serverless ecosystem is super daunting in terms of how many choices there are! Firstly there are the functions from all the main providers, Azure, GCP and AWS which all operate largely the same way. Then there’s serverless “solutions” like Netlify functions and Begin. In AWS-land, there’s not only Lambda but there’s also SAM (serverless application model) which claims to simplify things and at this point I’ve hit analysis paralysis and don’t know what’s good for me. I also ventured down the Ruby rabbit hole, which has an entire serverless framework called Jets, another serverless solution called Lamby and I just ran into problems with all of them.

I don’t mean to shit on these tools and solutions – I view these failures as failures of my own, as a result of working with a slightly too-abstracted solution, that I really didn’t know what they were doing for me, and that I couldn’t fix the bugs because, well, I didn’t know how serverless apps worked in the first place. 

Then I went to the opposite extreme and went straight into using the plain-ass AWS CLI to make the function and that had so much boilerplate writing that I understood why there were so many tools and solutions out there to remove some of that tedious configuration from the process. I found the happy medium in the Serverless Framework, and I finally understand why it has a following. Lots of articles, lots of examples, plugins, and the community seems to have reached that critical mass where there are enough Stack Overflow answers to get you through most of your problems. And it got me through my problems. For what it’s worth, if you’re afraid of using a third-party solution, I’ve also seen AWS Amplify as another viable solution. End of aside, let's get cracking.
</details>

# Part 0: Pre-requesites

Serverless functions are, at their core, extremely simple. Configuration ends up being the biggest bugger. Still, there are a few things I assume in this tutorial:

* Familiarity with Javascript, Node, npm. All installed
* An AWS account. [Sign up for one][console.aws.amazon.com/] if you don't have it.
* 

# Part 1: Setting up a Project with Serverless Framework

---
### Give Serverless Framework your AWS Credentials

If you already have worked with Serverless and AWS Lambda this may already be configured. If not, let me say that much of the benefit of Serverless Framework is that it creates and deploys a lot of AWS resources on your behalf. To do, though, that it needs be able to access those resources, so there is some initial configuration that needs to take place. For that, insead of re-write their docs [I'll point you to the Serverless blog](https://www.serverless.com/framework/docs/providers/aws/guide/credentials/) which describes how to provide Serverless with those capabilities. It may feel like a lot of configuration, but once it's done we don't have to touch it again. 

### Scaffolding the Project

After you've gotten that done, it's time to create your project.

What we’re trying to do is *connect an AWS Lambda to a relational database*. So naturally you need to decide whether you’re using MySQL or Postgres. I chose Postgres. This will impact several of the steps later on. 

To scaffold a Serverless project run in your Terminal: 

```
$ serverless create —template aws-nodejs —path sls-new-project
``` 

This will create a folder called `sls-new-project` that contains just two files, `handler.js` which has your function’s logic, and `serverless.yaml` which contains all the configuration. Very minimal to start.

### Setting up a local database and Sequelize

We want to use Postgres and an object-relational mapper (ORM) called Sequelize. So let's install those dependencies into our project via npm.

First `npm init` to create a `package.json` in our project. Then start installing some dependencies: 
```
npm install --save pg
npm install --save pg-hstore
npm install --save sequelize
npm install -—save-dev sequelize-cli
```



Because we’ll be running some migrations we want to use `sequelize-cli` to generate those migrations. We can run `npx sequelize-cli init` which will create a migrations folder, config which tells the cli how to connect to the database for each environment, models folder for our various models, and seeders. You can get the full instructions for initializing `sequelize-cli` [here](https://sequelize.org/master/manual/migrations.html). 

If you read the contents of the just-created `config/config.json` you’ll see it’ configured for MySQL. Few things to change: 
* Go ahead and change those to `postgres` and save them. 
* Also, change the `username` value under `development` to the name of your root user of your device. 
* Also, please change the name of the database to something like `sls-starter` or something related to the name of your project.

Remember, this config *only* tells the CLI how to access the database, so we also have to tell our application to access the database. We’ll do this in a separate file, in the next step.

We don’t have any models yet, but we’ll start creating them soon. But last step before that we have to *create* the local database: do so with the command `npx sequelize-cli db:create`. 

If it fails, you probably missed changing something in the `config/config.json` file. Follow the steps above to make sure the user is the root user on your device, the database name is unique, and you’re using the correct type of database `postgres`. For now you only need to change those values under `development`.

For reference, here’s my `config/config.json`
```json
{
  "development": {
    "username": "dengel",
    "password": null,
    "database": "sls-starter",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  "test": {
    "username": "dengel",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  "production": {
    "username": "dengel",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "postgres"
  }
}
```

When it succeeds you’ll see the message: 

```shell
Sequelize CLI [Node: 10.16.0, CLI: 6.2.0, ORM: 6.3.5]

Loaded configuration file "config/config.json".
Using environment "development".
Database sls-starter created.
```

The link above can help with creating models too; for this tutorial we're going to leave that to the end, first simply ensuring we can make database connections successfully.

At this point your project file structure should look like this:

![file structure at this point of project](/images/aws-pg/aws-pg-file-structure-1.png)

### Connecting to the local database in the application

Okay, we’ve installed a lot of things and now it’s time to write some connection logic. 

We'll do that in a separate file called `connection.js`, which we'll create at the root of the project. 
 
```javascript
const { Sequelize } = require('sequelize');
const pg = require('pg')

const sequelize = new Sequelize('sls-starter', 'dengel', '', {
  dialect: 'postgres',
  dialectModule: pg,
  host: '127.0.0.1'
})

module.exports = sequelize

```

You’ll notice a few things about the above code:
1. that we’ve hardcoded the `dbname`, `username`,  `password` (which is null) and `db.endpoint.url` in the configuration. This isn’t good practice and we will look at how to use environment variables to make this dynamic based on the environment in a later step.
2. We require the `pg` postgres `node_module` here and pass that object in as the `dialectModule` option in the `Sequelize` constructor. This is necessary for the Lambda function, Sequelize, and Postgres to work together harmoniously. 

We’ve exported that connection logic, now let’s import it into our `handler.js`.

Delete everything that the `serverless create` command created earlier in this file and let’s start fresh.

We’re going to be using http triggers for the functions, so we also want to install the following packages:

```
npm install —-save serverless-http
npm install --save express
``` 

Then require them in our `handler.js`

```javascript
'use strict';
const db = require('./connection.js');
const serverless = require('serverless-http');
const express = require('express');
const app = express();
```

And now we can add a function to test our database connection.
```javascript
app.get('/test', async function (req, res) {

let msg;
try {
  await db.authenticate();
  msg = 'Connection successful'
} catch (error) {
  msg = 'Unable to connect to the database:'
  console.error('Unable to connect to the database:', error);
}

  return res.send(msg)
})

module.exports.index = serverless(app)
```

We’re almost ready to test our function. 

When it comes to testing things, one of the most important factors is finding ways to speed up the feedback loop. It would be a shame if the only way to test our functions was by deploying them and seeing if they work on production. That’s why we’re going to install some more plug-ins.

### Speeding up our feedback loop

The Serverless Framework plugins we use assist our development, `serverless-offline` to test our functions locally to speed up the feedback loop (crucial) and `serverless-sequelize-migrations` which takes our migrations and runs them on the production environment for us. We’ll use it a little later in our project. These aren’t npm packages, but plugins that we install via the `serverless` CLI then refer to in our `serverless.yaml`. 

So first, from your project root run in the terminal the following commands:
```shell
serverless plugin install —name serverless-offline
serverless plugin install —name serverless-sequelize-migrations
``` 

Then go into your `serverless.yaml` file which we haven't touched at all yet.

You can take a look at all the different options that are commented out. I will only touch on the ones that are important for us now.

You can leave the `server` and `provider` configurations, and now we’re going to add a `plugins` section at the highest level of the `yaml`.

```yaml
plugins:
  - serverless-offline
  - serverless-sequelize-migrations
```

We can also change the details of the `functions` section to more accurately reflect what’s now in our `handler.js`:

```yaml
functions:
  app:
    handler: handler.index
    events:
      - http: ANY /
      - http: 'ANY {proxy+}'
```

This tells Serverless how to configure out AWS Lambda when we eventually deploy it, but also what options will be available to use locally, and how to access our function (via handler.index, where `handler` refers to what we named the file, and `index` refers to what we exported in `module.exports`.

Now it’s time to check if it’s working.

### Local Smoke Test and Next Steps

A smoke test just a simple test to see if things are working as expected. The logic of our only function runs Sequelize’s `db.authenticate()` function and prints whether it successfully connects or not.

To test, we’ll run `sls offline` which now starts a local mock of our serverless function. We can visit http://localhost:3000/dev/test to see if our function is successful. And if everything was followed correctly, you should see “Connection successful” or whatever your success message in the function was in the browser. 

But, if you were to run `sls deploy` at this point and try this in production, it would fail because 
1. we don’t have a production database and,
2. AWS Lambda can’t speak Postgres without some more extra configuration. 

That’s what we’ll do in the [next post](/blog/part-2-connecting-aws-lambda-to-a-postgres-db/), as well as separating our environments.

