function setTrigger() {
  ScriptApp.newTrigger("mainScript")
    .forForm(FORMID) // from env.js
    .onFormSubmit().create()
}

function test() {
  let headers = {
    "Accept": "application/hal+json,text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Content-Type": "application/json;charset=UTF-8"
  }

  var result = AWS2.request({
    accessKey: AWS_ACCESS_KEY,
    secretKey: AWS_SECRET_KEY,
    service: SERVICE,
    region: REGION,
    method: "POST",
    path: 'dev/pipeline/recordings',
    headers,
    payload: { test: "YES" }
  })

  Logger.log(result.getResponseCode()); // ➝ 200
  Logger.log(result.getContentText());  // ➝ { "message": "Hello Google!" }
}