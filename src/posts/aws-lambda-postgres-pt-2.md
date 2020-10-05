---
title: 'Part 2 Connecting AWS Lambda To A Postgres DB'
date: '2020-10-05'
---

##### In the [previous post](/blog/part-1-connecting-aws-lambda-to-a-postgres-db/), we got our Serverless function running locally, but hadn't set up our production database. In the process of doing that, this post deals with setting up an AWS RDS instance, configuring the security group to allow access, configuring the serverless.yaml file to hold different values for dev and prod environments, and setting up a Postgres Lambda Layer. It's a lot to cover, so let's get cracking!

## Setting up AWS resources
Because this is going to be an AWS Lambda, we’re going to set up some AWS resources. Although we’re only going to manually set up an AWS RDS instance – aka our production database – this section will also touch upon,  VPCs, subnets, and security groups. 

### Create an AWS RDS instance

Here I’m going to defer to Amazon’s instructions on [how to purchase and set up an RDS instance](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_GettingStarted.CreatingConnecting.PostgreSQL.html). Follow their instructions up to the point where they begin discussing security groups. Very important: when creating the database, do not forget open the “Additional Configuration” section and enter a database name! If you don’t give it a name the database will not be created.

![Additional configuration page for rds setup](/images/aws-pg/aws-pg-additional-config.png)

Also important: when you create a password for the database, do not forget it! Write it down somewhere. All the other information we’ll need soon can be read straight from the console if we ever forget it, but the database password is not so easily retrievable. 

### Configuring security group rules
If you don’t do anything to the security group rules, you’ll end up with a Connection Timeout every time you try to connect to your database. 

In order to change the security group rules, simply click the link under VPC security groups, which will take you to the page where you can configure it. 

![The settings page showing Connectivity & Security of an RDS instance](/images/aws-pg/aws-pg-rds-settings.png)

From that page, scroll down to find the ‘Edit Inbound Rules’ section and change the rules to look like the ones in the screenshot below: 
Two rules with 
* Type: PostgreSQL
* Protocol: TCP
* Port range: 5432

One of those rules with source 0.0.0.0/0 and the other with ::/0. 

![The settings for a security group to be able to access a Postgres instance](/images/aws-pg/aws-pg-security-group-settings.png) 

Save rules and go back to your RDS. Keep the window with our RDS instance open because we’re going to use some of the info shortly.

##  Configuring our production settings in our application
So we have two main places that read information about our database: `config/config.json`, which `sequelize-cli` references for where to make migrations, and `connection.js` which our application uses to make connections to the database. We’re going to need to make sure the information in these places is now up to date with our newly created production db credentials.

### Update config.json

Go into `config/config.json` and under `production` add the dbname, username, password, and host (the endpoint url) for our production database. Because this now has some sensitive information, it would be smart to add this file to our `.gitignore`, so go ahead and do that.

### Update connection.js with environment variables
Next, we want to change the information we hardcoded into `connection.js`. Instead of just replacing it with the production database information, we’re going to configure our serverless function to be able to mock different environments depending on what we want to test.

So before we edit `connection.js`, first head over to `serverless.yml` and add the following, replacing the values with the values from *your* production and development databases:

```yaml
custom:
  env:
    prod: 
      stage: production
      db_dialect: "postgres"
      db_name: sls-starter-production
      db_username: root
      db_password: "123456"
      db_host: rds-endpoint.c2j1xg2t94lm.us-east-1.rds.amazonaws.com
      db_port: "5432"
    dev: 
      stage: development
      db_dialect: "postgres"
      db_name: sls-starter
      db_username: dengel
      db_password: null
      db_host: 127.0.0.1
      db_port: "5432"
```

This is going to allow us to run serverless offline without having to alter code based on which environment we need. In the `yaml` above, `custom` is part of the configuration that’s reserved for items we want to add that aren’t necessarily included in the options provided by Serverless Framework. Under that we’ve nested `env`, and under that the two environments we intend to use: `prod` and `dev`. We’ll see how these values are accessible now.

Under the `provider` section of the yaml, paste the following:
```yaml
provider:
	stage: ${opt:stage, 'dev'}
	environment:
  	DB_DIALECT: ${self:custom.env.${self:provider.stage}.db_dialect}
  	DB_NAME: ${self:custom.env.${self:provider.stage}.db_name}
  	DB_USERNAME: ${self:custom.env.${self:provider.stage}.db_username}
  	DB_PASSWORD: ${self:custom.env.${self:provider.stage}.db_password}
  	DB_HOST: ${self:custom.env.${self:provider.stage}.db_host}
  	DB_PORT: ${self:custom.env.${self:provider.stage}.db_port}
  	NODE_ENV: ${self:custom.env.${self:provider.stage}.stage}
```

Let me break this down. 

Let’s look at the first key, `stage`. The `opt:stage` that it is trying to read is from a flag we can pass to Serverless when we invoke it from the Command Line, we’ll do something like `sls offline -s dev`, which tells it to run in the development environment.  We also could pass `prod`. The second part of the value here, after the comma, just tells Serverless that if no `-s` flag is  provided when we invoke serverless, to *default* to `dev`. 

So now we know that `opt:` captures values passed in when we invoke Serverless. 

The values under `environment` will set values accessible through `process.env`, so we’ll be able to access them in our code. Let’s take a look at why they’re formatted the way they are.

They’re formatted like this `DB_DIALECT: ${self:custom.env.${self:provider.stage}.db_dialect}`. `self:custom` refers to the `custom` key we defined above in our `serverless.yaml`, and then we simply use dot-notation to access to values inside of that. Furthermore, we’re nesting `${self:provider.stage}` to see if it should access the values under `custom.env.dev` or `custom.env.prod`.  Again, if no flag is passed when we invoke any serverless command from the Command Line, it will default to the values under `custom.env.dev`. 

Now that we have this dynamic environment setting, we can remove the hard-coded configuration in our `connection.js` and replace it with something more standard:

```javascript
const { Sequelize } = require('sequelize');
const pg = require('pg')


const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  dialect: 'postgres',
  dialectModule: pg,
  host: process.env.DB_HOST
})

module.exports = sequelize
```

Let’s test this to see if it’s working. Replace the `msg` variable in our main function in `handler.js` with `process.env.DB_HOST` like this:

```javascript
/*...*/
app.get('/test', async function (req, res) {
  let msg;
  try {
	  // comment this part out
    // await db.authenticate();

	  // add this
    msg = process.env.DB_HOST
  } 
/*...*/
```

And then try running the function offline in dev mode
```bash
sls offline -s dev
```
And you should see your local server address when you visit http://localhost:3000/dev/test.

Then try it in prod mode:
```bash
sls offline -s prod
```
Visit http://localhost:3000/prod/test (don’t forget that when you test your endpoints it will add the stage before the endpoint), and you should see your production database host. 

If you’re still getting connection timeouts, make sure your credentials are correct and that the Security Group is set up to receive inbound traffic as described in the earlier step.

## Configuring VPC details
We have a few final things to configure before we deploy our Lambda. First, we want to tell the Lambda which security groups, subnets, and region to be associated with. These can be found on the page for the RDS database we set up. Simply grab any of the two subnets in the list and copy- paste their identifiers. Same with the security group. We’ll also add these values under the `provider` section:
```yaml
provider:
 vpc: 
    securityGroupIds: 
      - sg-8888888
    subnetIds:
      - subnet-222222
      - subnet-1111111
  region: us-east-1
```

These are necessary for when we finally deploy it, but you wouldn’t know it now because it looks like our function is working! That’s a little misleading! It’s one of the takeaways I’ve gotten from this process: you might have what looks like a perfectly working serverless function, but it will error in production. Anyways, don’t worry about that just yet, we’ll be able to mitigate most of the problems before deployment, so don’t be discouraged if one pops up. 

Moving on, we have one last thing to do, which is set up our Postgres Lambda Layer, which will allow our Lambda to speak to our production database.

## Setting up a Lambda layer
There’s a lot of different tutorials out there on how to create a Lambda layer. I’ve tried several and this was by far the quickest and simplest approach for me, so it comes with my recommendation. 

First, create a folder in the root of your project called `layer`.

If you’ve ever worked with Postgres before, you will have installed the native binaries, specifically one called `libpq`. To find out for sure, use the following command: 

```bash
find / -name libpq
``` 

If you’ve installed Postgres before, you should see some file paths returned from this command (if you can’t find it, you can download the file from the Github repo provided with this tutorial). If you do see it, `cd` into one of those and copy the `libpq` file (it might be called `libpq.so` or `libpq.so.5`) into the `layer` folder in your project that you just created.

Your folder structure should now look like this:

![The final file structure should look like this](/images/aws-pg/aws-pg-file-structure-2.png)

Next you’ll add some more configuration to your `serverless.yml`  which will instruct Serverless to upload the layer to AWS, and have your Lambda utilize the layer. By doing this little configuration, Serverless takes care of most of the AWS configuration for  you. 

So let’s add two new details to the `serverless.yml`:

1. At the top level of the `yaml`,  add the following. Note that `path: layer` refers to the folder our Postgres binary is located. We’ve named it `pg` here but we could name it anything:

```yaml
layers:
  pg:
    path: layer
```

2. In the section of the yml that describes the app, under function add :
```yaml
functions:
  app:
    handler: handler.index
    events:
      - http: ANY /
      - http: 'ANY {proxy+}'
    layers:
      - {Ref: PgLambdaLayer}
```

We describe that the function in `app` make use of the layer which gets named `PgLambdaLayer`, based on what we called our layer in the previous step. If we named it `postgres` instead of `pg` we would have to instead write `{Ref: PostgresLambdaLayer}`. 

## serverless.yml in its entirety
Now that we’ve added all this configuration, let’s look at what our whole `serverless.yml`  file should look like:

```yaml
service: sls-new-project
custom:
  env:
    prod: 
      stage: production
      db_dialect: "postgres"
      db_name: sls-starter-production
      db_username: root
      db_password: "123456"
      db_host: rds-endpoint.c2j1xg2t94lm.us-east-1.rds.amazonaws.com
      db_port: "5432"
    dev: 
      stage: development
      db_dialect: "postgres"
      db_name: sls-starter
      db_username: dengel
      db_password: null
      db_host: 127.0.0.1
      db_port: "5432"
layers:
  pg:
    path: layer
provider:
  name: aws
  runtime: nodejs12.x
  vpc: 
    securityGroupIds: 
      - sg-8888888
    subnetIds:
      - subnet-88888899
      - subnet-22222222
  region: us-east-1
  stage: ${opt:stage, 'dev'}
  environment:
    DB_DIALECT: ${self:custom.env.${self:provider.stage}.db_dialect}
    DB_NAME: ${self:custom.env.${self:provider.stage}.db_name}
    DB_USERNAME: ${self:custom.env.${self:provider.stage}.db_username}
    DB_PASSWORD: ${self:custom.env.${self:provider.stage}.db_password}
    DB_HOST: ${self:custom.env.${self:provider.stage}.db_host}
    DB_PORT: ${self:custom.env.${self:provider.stage}.db_port}
    NODE_ENV: ${self:custom.env.${self:provider.stage}.stage}
functions:
  app:
    handler: handler.index
    events:
      - http: ANY /
      - http: 'ANY {proxy+}'
    layers:
      - {Ref: PgLambdaLayer}
plugins:
  - serverless-offline
  - serverless-sequelize-migrations
```

## Deploying
Now we’re ready to deploy. Make sure to change your function code back to using `db.authenticate()` as that will be the proof that we’ve made a successfully db connection and that our Serverless app is utilizing the layer we just created to talk in Postgres to our RDS instance.

This first deployment will be slower than the rest because it will have to create the Lambda layer, but subsequent deploys will skip this step. When you’re ready, go ahead and deploy it with the following command:

```bash
sls deploy -s prod
```

Serverless will output in the terminal all the steps it’s taking to deploy your Lambda, including the step of building your lambda layer. When it’s done, visit the link it’s provided you or directly go to the endpoint you created in order to see it in action!

And if you see that your connection is successful, congrats! If we’re still seeing errors, I recommend again to check to see if your connection credentials are correct and that the security group is configured as mentioned earlier, allowing Postgres TCP connections from 0.0.0.0/0 and ::/0. 

If it’s working, you can move onto the next step, which is creating some migrations and models locally, pushing those migrations  to your production server, which will be covered in the next (much shorter) post coming soon.