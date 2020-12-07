var ID_MAP = {
  1166414688: { columnName: "singerName", keyWords: ["first", "last"] },
  1089943877: { columnName: "singerEmail", keyWords: ["email"] },
  1233941124: { columnName: "songTitle", keyWords: ["guitar", "tab", "link"] },
  1829071455: { columnName: "key", keyWords: [] },
  764310260:  { columnName: "tabLinkUsed", keyWords: [] },
  450104603: { columnName: "transpositionFromTab", keyWords: [] }
}

var FILE_ID = 1101097732
var FILE_COLUMN_NAME = "fileId"
var DATE_COLUMN_NAME = "updateDate"
var RESPONSE_COLUMN_NAME = "formId"

function mainScript() {
  var form = FormApp.openById(FORMID)
  if (form) {
    var warnings = checkFormQuestions(form)

    let responses = form.getResponses()
    let response = responses[responses.length - 1]
    
    // let responseId = response.getId() // should we check for race conditions?
    var data = getLatestResponse(response, form, warnings)

    sendToPipeline({ data, warnings })
  } else {
    sendToPipeline({ data: {}, warnings: {
      level: 500,
      error: `Form not found with ID: ${FORMID}`,
      description: `You may have deleted the form. Click on the new form, the ID is in the URL.`
    }})
  }
}

function checkFormQuestions(form) {
  var warnings = []

  for (let id of Object.keys(ID_MAP)) {
    let question = form.getItemById(id)
    if (question) {
      let questionString = question.getTitle()
      Logger.log(`${id} :: ${ID_MAP[id]}`)
      for (let keyWord of ID_MAP[id].keyWords) {
        if (!questionString.toLowerCase().includes(keyWord)) {
          warnings.push({
            level: 400,
            error: `QuestionId: ${id} does not contain keyword '${keyWord}'`,
            description: `This is just a check to ensure the question still relates to whats populated in the database.
                          If this keyword is nolonger needed (ie. its put in the description), notify Dom. 
                          In general, there is no data loss. However, the wrong data could be populated if the user is not asked the right question.`
          })
        } 
      }
    } else {
      warnings.push({
        level: 500,
        error: `Question not found: ${id}!`,
        description: `The following dynamoDB column is affected: '${ID_MAP[id].columnName}'. Please contact Dom at your earliest convince as this error indicates data loss.
                      If the question was deleted and then recreated at the bottom of the form, have Dom run checkFormID() to get the latest IDs. After fixing the issue, run repopulate() manually on GAS.
                      This question was likely a foundational column in the database, a change may result in redesiging the whole data pipeline system.`
      })
    }
  }

  return warnings
}

function getLatestResponse(response, form, warnings) {
  var data = {}

  if (response) {
    data[RESPONSE_COLUMN_NAME] = `${response.getId()}`
    
    for (let id of Object.keys(ID_MAP)) {
      let answer = response.getResponseForItem(form.getItemById(id))
      if (answer) { data[ID_MAP[id].columnName] = `${answer.getResponse()}` }
      else { console.error(`Error should already be logged to user via checkFormQuestions(); Error: ${ID_MAP[id].columnName}`) }
    }
  
    // passing fileId to backend for fetch
    let fileAnswer = response.getResponseForItem(form.getItemById(FILE_ID))
    if (fileAnswer) {
      data[FILE_COLUMN_NAME] = `${fileAnswer.getResponse()}`
    } else {
      warnings.push({
        level: 500,
        error: `Expected audio upload question ID to be ${FILE_ID}; but found nothing.`,
        description: `You may have changed or deleted the upload question, resulting in a new ID. Contact Dom immediately.
                      Impact: No file will be uploaded to S3. checkFormID() to get the latest IDs. After fixing the issue, run repopulate() manually on GAS.`
      })
    }
  
    let submittedTimestamp = response.getTimestamp()
    if (submittedTimestamp) { data[DATE_COLUMN_NAME] = submittedTimestamp.toString() }
    else {
      warnings.push({
        level: 500,
        error: `No Timestamp detected.`,
        description: `Pretty darn big error. 1 possible explaination is that the response was never submitted.`
      })
    }
  } else {
    warnings.push({
      level: 500,
      error: `No Response found.`,
      description: `Pretty darn big error. I'm not sure why the response is null.`
    })
  }

  return data
}

function sendToPipeline( payload ) {
  let headers = {
    "Accept": "application/hal+json,text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Content-Type": "application/json;charset=UTF-8"
  }
  
  console.log(payload)

  var result = AWS2.request({
    accessKey: AWS_ACCESS_KEY,
    secretKey: AWS_SECRET_KEY,
    service: SERVICE,
    region: REGION,
    method: "POST",
    path: 'dev/pipeline/recordings',
    headers, payload
  })

  console.log(`ErrorCode of AWS API: ${result.getResponseCode()}`)
  console.log(`${result.getContentText()}`)
  console.log("DONE")
}