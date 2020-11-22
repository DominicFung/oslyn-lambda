const { google } = require('googleapis')
var drive = google.drive('v3')

var aws = require('aws-sdk')
aws.config.update({region: 'us-east-2'})


const env = require('./env')
const { Stream } = require('stream')

const S3 = new aws.S3({
  accessKeyId: env.S3_KEYS.accessKeyId,
  secretAccessKey: env.S3_KEYS.secretAccessKey
})

const SES = new aws.SES({region: 'us-east-1'})

/** 
 * NOTE: If a single file fails with status RED; the whole batch is RED. Thus why we use numbers 
 *    ie. if current status is RED, and the current file transfer status is GREEN - do not update the status.
*/
// var _STATUS = 0 // 0 = green; 1 = yellow; 2 = red;

const JWTClient = new google.auth.JWT(
  env.GOOGLE_API.client_email,
  null,
  env.GOOGLE_API.private_key,
  ["https://www.googleapis.com/auth/drive"]
)

const ACCEPTED_MIMETYPES = ['audio/mp4', 'audio/x-m4a', 'audio/mpeg']

async function service() {
  return new Promise( resolve => {
    JWTClient.authorize((err, tokens) => {
      if (err) { console.log(err); resolve(false) } 
      else {
        drive.files.list({ 
          auth: JWTClient,
          // q: `'${env.DRIVE_FOLDER_ID}' in parents and ( mimeType = 'audio/mp4' or mimeType = 'audio/x-m4a' )`
          q: `'${env.DRIVE_FOLDER_ID}' in parents`
          }, (err, resp) => {
          if (err) { console.error('err', err); resolve(false) } 
          else {
            if (resp.data.files) {
  
              var transactAllFiles = []
              for (let file of resp.data.files) {
                transactAllFiles.push(new Promise( resolve => {
                  console.log(file)
                  if (!ACCEPTED_MIMETYPES.includes(file.mimeType)) {
                    console.warn(`File/Folder is not an acceptable file type. Acceptable: ${ACCEPTED_MIMETYPES}`)
                    resolve( logEntry(1, file, "Incorrect Format") )
                  } else if (!file.name.endsWith('.m4a')) {
                    console.warn(`File/Folder is not an acceptable file extension. Acceptable: .m4a`)
                    resolve( logEntry(1, file, "Incorrect Format") )
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
                        resolve( logEntry(2, file, "Error downloading from Drive.") )
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
                          drive.files.update({
                            auth: JWTClient,
                            fileId: file.id,
                            removeParents: [env.DRIVE_FOLDER_ID],
                            addParents: [env.DRIVE_TODELETE_FOLDER_ID]
                          }, (err, resp) => {
                            if (err) { 
                              console.error()
                              resolve( logEntry(2, file, "Error moving to Drive delete folder.") )
                            } else { 
                              resolve( logEntry(0, file, "") )
                            }
                          })
                        }
                      })
                    })
                  } else { resolve( logEntry(2, file, "Error! file.id not available") ) }
                }))
              }
  
              Promise.all(transactAllFiles).then( async entries => {
                let status= 0, validEntries = [], exceptionEntries = []
                for ( let entry of entries ) {
                  if ( entry.status > 0 ) {
                    exceptionEntries.push(entry)
                  } else if ( entry.status === 0 ) {
                    validEntries.push(entry)
                  }
                  if (status < entry.status ) status = entry.status
                }
                let emailStatus = await sendUploadStatusEmail( status, validEntries, exceptionEntries )
                resolve(emailStatus)
              })
  
            } else { console.error("resp.data.files does not exist!"); resolve(false) }
          }
        })
      }
    })
  })
}

function logEntry(errorStatus, file, err) {

  let newFile = file
  newFile.status = errorStatus
  if ( errorStatus > 0 && errorStatus <= 2 ) {
    console.error(`Submit ${file.name} status: ${errorStatus}, error: ${err}`)
    newFile.error = err
  } else if (errorStatus === 0) {
    console.log(`Submit ${file.name} status: ${errorStatus}`)
  } else {
    console.error(`Submit ${file.name} status: ${errorStatus}, error: incorrect error status`)
    newFile.status = 2
    newFile.error = 'Incorrect error Status.'
  }

  return newFile
}

async function sendUploadStatusEmail(_STATUS, validEntries, exceptionEntries) {
  return new Promise(resolve => {
    var statusHtml = '<b style="color:green">Green</b>'
    if (_STATUS === 1) statusHtml = '<b style="color:darkgoldenrod">Yellow</b>'
    if (_STATUS === 2) statusHtml = '<b style="color:red">red</b>'

    var statusExplainationHtml = ''
    if (_STATUS === 1)
      statusExplainationHtml = `<p style="margin: 0; font-size: 12px;">
        There may be a misnamed file or a file of an incorrect format. Please find the summary below.
      </p>`
    if (_STATUS === 2)
      statusExplainationHtml = `<p style="margin: 0; font-size: 12px;">
        Please contact Dom. Status <b style="color:red">Red</b> means there is a failure mid script and a possiblity of an unrecoverable file. 
        At this point, do not move or delete any files from the Google Drive folders.
      </p>`

    var validListHtml = '<ul style="margin-top:10px; padding-left:20px;">'
    for ( let entry of validEntries ) {
      validListHtml+=`<li style="font-size:12px">${entry.name}</li>`
    }
    validListHtml+='</ul>'

    var errorTableHtml = `
    <table style="width:100%; font-size: 12px; margin-top:10px">
      <tr>
        <th style="border:gray solid; border-width: 1px;">File</th>
        <th style="border:gray solid; border-width: 1px;">Reason</th>
      </tr>`
    for ( let entry of exceptionEntries ) {
      errorTableHtml += 
      `<tr>
        <td>${entry.name}</td>
        <td>${entry.error}</td>
      </tr>`
    }
    errorTableHtml+='</table>'

    S3.getObject({
      Bucket: env.EMAIL_CONFIG.email_bucket,
      Key: env.EMAIL_CONFIG.email_key
    }, (err, data) => {
      if (err) { console.error('Error fetching status email template.'); console.error('err', err); resolve(false) } 
      else {
        var params = {
          Destination: {
            ToAddresses: env.EMAIL_CONFIG.to,
            BccAddresses: env.EMAIL_CONFIG.bcc
          },
          Message: {
            Body: {
              Html: {
                Charset: "UTF-8",
                Data: data.Body.toString()
                  .replace("{{Date}}", new Date().toString())
                  .replace("{{Status}}", statusHtml)
                  .replace("{{StatusReason}}", statusExplainationHtml)

                  .replace("{{InputFolderLink}}", `https://drive.google.com/drive/folders/${env.DRIVE_FOLDER_ID}`)
                  .replace("{{DeleteFolderLink}}", `https://drive.google.com/drive/folders/${env.DRIVE_TODELETE_FOLDER_ID}`)

                  .replace("{{ValidNumber}}", validEntries.length)
                  .replace("{{ValidList}}", validListHtml)
                  .replace("{{ErrorNumber}}", exceptionEntries.length)
                  .replace("{{ErrorTable}}", errorTableHtml)
              }
            },
            Subject: { Data: `Oslyn Song-Transfer Status` }
          },
          Source: "\"Oslyn\" <admin@oslyn.io>"
        }

        SES.sendEmail(params, (err, data) => {
          if (err) {
            console.error('Error sending status email.')
            console.error('err', err)
            resolve(false)
          } else { console.log('Email Sent. OK'); resolve(true) } 
        })
      }
    })
  })
}

exports.service = service