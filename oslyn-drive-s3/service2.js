const { google } = require('googleapis')
var drive = google.drive('v3')

var aws = require('aws-sdk')
aws.config.update({region: 'us-east-2'})
var fs = require('fs')

const env = require('./env')
const { Stream } = require('stream')

const S3 = new aws.S3({
  accessKeyId: env.S3_KEYS.accessKeyId,
  secretAccessKey: env.S3_KEYS.secretAccessKey
})

const JWTClient = new google.auth.JWT(
  env.GOOGLE_API.client_email,
  null,
  env.GOOGLE_API.private_key,
  ["https://www.googleapis.com/auth/drive"]
)

const ACCEPTED_MIMETYPES = ['audio/mp4', 'audio/x-m4a']
var validEntries = []
var exceptionEntries = []

JWTClient.authorize(function(err, tokens) {
  if (err) { console.log(err); return; } 
  else {
    drive.files.list({ 
      auth: JWTClient,
      // q: `'${env.DRIVE_FOLDER_ID}' in parents and ( mimeType = 'audio/mp4' or mimeType = 'audio/x-m4a' )`
      q: `'${env.DRIVE_FOLDER_ID}' in parents`
     }, (err, resp) => {
      if (err) { console.error('err', err) } 
      else {
        if (resp.data.files) {
          for (let file of resp.data.files) {
            console.log(file)
            if (!ACCEPTED_MIMETYPES.includes(file.mimeType)) {
              file.error = `File/Folder is not an acceptable file type. Acceptable: ${ACCEPTED_MIMETYPES}`
              exceptionEntries.push(file)
              console.warn('warn', file.error)
            } else if (file.id) {
              drive.files.get({
                auth: JWTClient,
                fileId: file.id,
                alt: 'media'
              }, {responseType: 'stream'})
              .then(res => {
                var progress = 0
                
                // README: use fs if you want to write to local
                // var dest = fs.createWriteStream(`/Users/dominicfung/Documents/oslyn-drive-s3/tmp/${file.name}`)
                var dest = new Stream.PassThrough()
                
                res.data.on('end', () => {
                  if (process.stdout.isTTY) {
                    process.stdout.clearLine()
                    process.stdout.cursorTo(0)
                    process.stdout.write(`Done downloading file: ${file.name}.`)
                  } else console.log(`Done downloading file: ${file.name}.`)
                })
                .on('error', err => {
                  console.error(`Error downloading file: ${file.name}.`)
                  console.error(err)
                })
                .on('data', d => {
                  progress += d.length
                  if (process.stdout.isTTY) {
                    process.stdout.clearLine()
                    process.stdout.cursorTo(0)
                    process.stdout.write(`Downloaded ${progress} bytes for ${file.name}`);
                  } else console.info(`Downloaded ${progress} bytes for ${file.name}`)
                })
                .pipe(dest)

                var params = { Bucket: env.S3_KEYS.bucket, Key: `${env.S3_KEYS.folder}/${file.name}`, Body: dest }
                var options = {partSize: 10 * 1024 * 1024, queueSize: 1}
                S3.upload(params, options, (err, data) => {
                  if (err) { console.log('err', err) }
                  else {
                    console.log(data)
                    deleteFileFromGoogleDrive(JWTClient, file.id)
                  }
                })
              })
            }
          }
        } else { console.error("resp.data.files does not exist!") }
      }
    })
  }
})

console.log("Script Running ..")

var deleteFileFromGoogleDrive = async (JWTClient, fileId) => {
  drive.files.update({
    auth: JWTClient,
    fileId: fileId,
    removeParents: [env.DRIVE_FOLDER_ID],
    addParents: [env.DRIVE_TODELETE_FOLDER_ID]
  }, (err, resp) => {
    if (err) { console.error('err', err) } 
    else { console.log(resp) }
  })
}

var sendUploadStatusEmail = async () => {
  
}