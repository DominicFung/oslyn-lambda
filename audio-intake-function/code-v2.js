function setTrigger() {
  ScriptApp.newTrigger("mainScript")
    .forForm(FORMID) // from env.js
    .onFormSubmit().create()
}

function mainScript() {
  var result = AWS2.request({
    accessKey: AWS_ACCESS_KEY,
    secretKey: AWS_SECRET_KEY,
    service: '9hxlw25y66.execute-api',
    region: 'us-east-2',
    path: 'dev/beta/count'
  })

  Logger.log(result.getResponseCode()); // ➝ 200
  Logger.log(result.getContentText());  // ➝ { "message": "Hello Google!" }
}

function test3() {
  var result = AWS2.request({
    accessKey: AWS_ACCESS_KEY,
    secretKey: AWS_SECRET_KEY,
    service: '9hxlw25y66.execute-api',
    region: 'us-east-2',
    path: 'dev/beta/count'
  })

  Logger.log(result.getResponseCode()); // ➝ 200
  Logger.log(result.getContentText());  // ➝ { "message": "Hello Google!" }
}