function setTrigger() {
  ScriptApp.newTrigger("mainScript")
    .forForm(FORMID) // from env.js
    .onFormSubmit().create()
}

function test3() {
  var result = AWS2.request({
    accessKey: AWS_ACCESS_KEY,
    secretKey: AWS_SECRET_KEY,
    service: SERVICE,
    region: REGION,
    path: 'dev/beta/count'
  })

  Logger.log(result.getResponseCode()); // ➝ 200
  Logger.log(result.getContentText());  // ➝ { "message": "Hello Google!" }
}

function mainScript() {
  var result = AWS2.request({
    accessKey: AWS_ACCESS_KEY,
    secretKey: AWS_SECRET_KEY,
    service: SERVICE,
    region: REGION,
    path: 'dev/beta/count'
  })

  Logger.log(result.getResponseCode()); // ➝ 200
  Logger.log(result.getContentText());  // ➝ { "message": "Hello Google!" }
}