function checkFormID() {  }

function repopulate() {
  var form = FormApp.openById(FORMID)
  if (form) {
    var warnings = checkFormQuestions(form)
    let responses = form.getResponses()
    for (let response of responses) {
      var data = getLatestResponse(response, form, warnings)
      sendToPipeline({ data, warnings })
    }
  } else {
    sendToPipeline({ data: {}, warnings: {
      level: 500,
      error: `Form not found with ID: ${FORMID}`,
      description: `You may have deleted the form. Click on the new form, the ID is in the URL.`
    }})
  }
}