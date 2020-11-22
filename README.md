# Oslyn-Lambda (Utility)

Oslyn is your digital bandmate; She is an AI app that listens to you play and accompanies you with synth/pad sounds. These are some of the back-end utility lambda functions we use to process audio files before submitting it to our AI models.

## Instructions

Each of these folders is a nodejs project consisting of a single function (compatible with AWS Lambda). Some are then hooked up to Cloudwatch for scheduling.

**To set up the functions locally:**

create an **env.js**. Feel free to reach out to me for specs.

```bash
# ex. cd oslyn-drive-s3
npm install
npm run test
```

## Setting up your AWS Lambda Functions
Create your lambda functions via the [AWS console](https://ca-central-1.console.aws.amazon.com/lambda/home). 
1. Click "Create Function" --> "Author from Scratch". Make sure you're using Nodejs v12.x
2. Create a test by clicking on "Configure test events"

**Note** down the *name* and *region* you place your function in.

### Uploading your code to Lambda
```bash
# cd oslyn-drive-s3
zip -r lambdaFunction.zip .

aws --region [REGION] lambda / 
  update-function-code --function-name oslyn-drive-s3 / 
  --zip-file fileb:///Users/[REPO LOCATION]/oslyn-lambda/oslyn-drive-s3/lambdaFunction.zip
```

In your Lambda "Basic settings" set ***Timeout to 2 min*** and ***Memory to 512MB***

Enjoy!

## License
[MIT](https://choosealicense.com/licenses/mit/)