const { google } = require('googleapis')
//var drive = google.drive('v3');

var groups = google.groupssettings('v1')
const env = require('./env')

const JWTClient = new google.auth.JWT(
  env.GOOGLE_API.client_email,
  null,
  env.GOOGLE_API.private_key,
  ["https://www.googleapis.com/auth/apps.groups.settings"]
)

JWTClient.authorize(function(err, tokens) {
  if (err) {
      console.log(err);
      return;
  } else {
    groups.groups.get({ 
      auth: JWTClient,
      groupUniqueId: "oslyn-testers@googlegroups.com"
    }, function(err, resp) {
      // handle err and response
      console.log('err', err);
      console.log('resp', resp);
    })
  }
})

console.log("done")