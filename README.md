# Oslyn-Lambda (Utility)

Oslyn is your digital bandmate; She is an AI app that listens to you play and accompanies you with synth/pad sounds. These are some of the back-end utility lambda functions we use to process audio files before submitting it to our AI models.

## Instructions

Each of these folders is a nodejs project consisting of a single function (compatible with AWS Lambda). Some are then hooked up to Cloudwatch for scheduling.

```bash
# ex. cd oslyn-drive-s3
npm install
node service
```

## Setup
Generally, we put our credentials in **env.js**. Feel free to reach out to me for specs.

## License
[MIT](https://choosealicense.com/licenses/mit/)