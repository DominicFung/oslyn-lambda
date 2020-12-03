function setTrigger() {
  ScriptApp.newTrigger("mainScript")
    .forForm("**")
    .onFormSubmit().create()
}


function mainScript() {
  let FORMID = "**"
  
  let CACHESHEETNAME = "Train Oslyn Entry Cache"
  let FOLDERID = "**"
  let SHEETNAME = "song recordings"

  var potentialFiles = DriveApp.getFilesByName(CACHESHEETNAME)
  var file = null
  var isFoundInFolder = false
  
  while (potentialFiles.hasNext()) {
    file = potentialFiles.next()
    let locations = file.getParents()
    
    console.log(`Spreadsheet Found! File ID: ${file.getId()}`)
    
    while (locations.hasNext()) {
      if (locations.next().getId() === FOLDERID) {
        isFoundInFolder = true
        break
      }
    }
    
    if (isFoundInFolder) { break }
  }

  if (!isFoundInFolder) {
    return createSheetFromForm(CACHESHEETNAME, FOLDERID, FORMID)
  } else if (file && isFoundInFolder) {
    console.log("Cache Sheet Found, creating new sheet ..")
    let ourSheet = SpreadsheetApp.open(file).getSheetByName(SHEETNAME)
    return readAndAddFormInfo(ourSheet, FORMID, null)
  } else { console.error("Form is null!"); return 1 }
}

function getFormQuestions(formId) {
  let form = FormApp.openById('1ZL_7CX6c13wbFcI6CjL8rnDZjv8bGyngGn36guJGqfE')
  let questions = form.getItems()
  let value = {
    title: ["Response ID"],
    questionId: [""],
    type: [""]
  }
  
  for (let q in questions) {
    let title = questions[q].getTitle()
    let questionId = questions[q].getId()
    let type = questions[q].getType()
    
    console.log(title+" :: "+questionId+" :: "+type)
    value.title.push(title)
    value.questionId.push(questionId)
    value.type.push(type)
  }
  
  return value
}

function createSheetFromForm(cacheSheetName, parentFolderId, formId) {
  var value = getFormQuestions(formId)
  
  var ourSpreadSheet = SpreadsheetApp.create(cacheSheetName)
  var fileId = ourSpreadSheet.getId()
  var file = DriveApp.getFileById(fileId)
  DriveApp.getFolderById(parentFolderId).addFile(file)
  file.getParents().next().removeFile(file)
  
  var ourSheet = ourSpreadSheet.getActiveSheet()
  ourSheet.setName("song recordings")
  
  ourSheet.appendRow(value.title)
  ourSheet.appendRow(value.questionId)
  ourSheet.appendRow(value.type)
  
  console.log("New spreadsheet created.")
  return readAndAddFormInfo(ourSheet, formId, value)
}

function readAndAddFormInfo(sheet, formId, value) {
  var form = FormApp.openById(formId)
  
  var idOrder = null
  if (!value) {
    value = getFormQuestions(formId)
    if (!checkFormSameAsSheet(sheet, form)) { return 1 }
  }
  
  let warningEmail = false
  
  let responses = form.getResponses()
  let response = responses[responses.length - 1]
  let insert = []

  let rowNum = checkIfResubmit(response.getId(), sheet)
  if (rowNum) {
    console.log(`Resubmit Detected - Deleting row ${rowNum}`)
    sheet.deleteRow(rowNum)
  }
  
  console.log("Populating info now ..")
  for (let i in value.questionId) {
    if (value.questionId[i] != '') {
      let answer = response.getResponseForItem(form.getItemById(value.questionId[i]))
      if (answer) {
        insert.push(`${answer.getResponse()}`)
      } else {
        console.log("Unfound Answer ID: "+value.questionId[i])
        warningEmail = true
      }
    } else {
      insert.push(response.getId())
    }
  }

  sheet.appendRow(insert)
  console.log("Populating info complete!")
  return 0
}

function checkIfResubmit(responseId, sheet) {
  /**
  * Read through sheet, see if the response ID already exists.
  *.   If YES = return row number
  *.   If NO = return null
  */
  
  var data = sheet.getDataRange().getValues()
  for(var i = 0; i<data.length;i++){
    if(data[i][0] == responseId){ return i+1 }
  }
  
  return null
}

function checkFormSameAsSheet(sheet, form) {
  /*
    Return true if everything is the same
    Return false otherwise
  */
  var questions = form.getItems()
  for (let i in questions) {
    let textfinder = sheet.createTextFinder(questions[i].getId())
    if (!textfinder.findNext()) {
      console.error(`Question ID was not found! ${questions[i].getId()}; 
        Manually trigger AWS to flush the records. Something may have changed on the form. This is complicated.`)
      return false
    }
  }

  console.log("Form & Sheet are in sync! Continue ..")
  return true
}
    
function checkFormValidity(value, sheet) {
  /**
  * This function checks if the form has changed over time -- Will warn us because downstreams may not be compatible
  */
  
  let firstLastId = 1166414688
  let emailId = 1089943877
  let guitarTabsId = 764310260
  let songTitleId = 1233941124
  let keyId = 1829071455
  let capoId = 450104603
  let fileId = 1101097732
  
  let warningMsgs = []
  
  let firstLastNameItem = form.getItemById(firstLastId)
  if (firstLastNameItem) {
    if (!firstLastNameItem.getTitle().toLowerCase().includes("first") || !firstLastNameItem.getTitle().toLowerCase().includes("last")) {
      warningMsgs.push('First/Last name question is missing the key words "first" and "last". If you\'re sure about this, ignore this warning.')
    }
  } else {
    warningMsgs.push('The original first/last name question has been deleted. If you\'ve moved the question elsewhere, please have Dom fix the pointer.')
  }
  
  let emailItem = form.getItemById(emailId)
  if (emailItem) {
    if (!emailItem.getTitle().toLowerCase().includes("email")) {
      warningMsgs.push('Email question is missing the key word "email". If you\'re sure about this, ignore this warning.')
    }
  } else {
    warningMsgs.push('The original email question has been deleted. If you\'ve moved the question elsewhere, please have Dom fix the pointer.')
  }
  
  let guitarTabsItem = form.getItemById(guitarTabsId)
  if (guitarTabsItem) {
    if (!guitarTabsItem.getTitle().toLowerCase().includes("guitar") || 
        !guitarTabsItem.getTitle().toLowerCase().includes("tab") ||
        !guitarTabsItem.getTitle().toLowerCase().includes("link")) {
      warningMsgs.push('The Guitar tabs question is missing the key words "guitar", "tab", and "link". If you\'re sure about this, ignore this warning.')
    }
  } else {
    warningMsgs.push('The original guitar tabs question has been deleted. If you\'ve moved the question elsewhere, please have Dom fix the pointer.')
  }
  
  let songTitleItem = form.getItemById(songTitleId)
  if (songTitleItem) {
    if (!songTitleItem.getTitle().toLowerCase().includes("song")){
      warningMsgs.push('The Song title question is missing the key word "song". If you\'re sure about this, ignore this warning.')
    }
  } else {
    warningMsgs.push('The original song title question has been deleted. If you\'ve moved the question elsewhere, please have Dom fix the pointer.')
  }
  
  let keyItem = form.getItemById(keyId)
  if (keyItem) {
    if (!keyItem.getTitle().toLowerCase().includes("key")){
      warningMsgs.push('The song key question is missing the key word "key". If you\'re sure about this, ignore this warning.')
    }
  } else {
    warningMsgs.push('The song key question has been deleted. If you\'ve moved the question elsewhere, please have Dom fix the pointer.')
  }
  
  let capoItem = form.getItemById(capoId)
  if (capoItem) {
    if (!capoItem.getTitle().toLowerCase().includes("transposition")){
      warningMsgs.push('The capo question is missing the key word "transposition". If you\'re sure about this, ignore this warning.')
    }
  } else {
    warningMsgs.push('The capo question has been deleted. If you\'ve moved the question elsewhere, please have Dom fix the pointer.')
  }
  
  let fileItem = form.getItemById(fileId)
  if (fileItem) {
    if (!fileItem.getTitle().toLowerCase().includes("upload")){
      warningMsgs.push('The audio upload question is missing the key word "upload". If you\'re sure about this, ignore this warning.')
    }
  } else {
    warningMsgs.push('The audio upload question has been deleted. If you\'ve moved the question elsewhere, please have Dom fix the pointer.')
  }
  
  console.log("WARNINGS:")
  console.log(warningMsgs)
  return warningMsgs
}
      