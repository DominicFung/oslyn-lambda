//const jwt = require('jsonwebtoken')
const request = require('request-promise')
const { google } = require('googleapis')

const env = require('./env')

const JWTClient = new google.auth.JWT(
  env.GOOGLE_API.client_email,
  null,
  env.GOOGLE_API.private_key,
  ["https://www.googleapis.com/auth/drive"]
)

JWTClient.getAccessToken( async (err, token) => {
  if (err) {
    console.log(err)
  } else {

    let folderID = "1nDBZSbxsh1GKj_XvPyATr6kFw9u2Ay7N"

    let option = {
      url: `https://developers.google.com/drive/api/v3/reference/files/list#http-request`,
      json: {
        data: {
          corpora: "user",
          includeItemsFromAllDrives: "false",
          supportsAllDrives: "true"
        }
      },
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }

    let option2 = {
      url: `https://www.googleapis.com/drive/v2/files/${folderID}/children`,
      json: {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    }

    try {
      let data = await request(option2)
      console.log(data)
    } catch (e) {
      console.log(e)
    }

    console.log("end")
  }
})