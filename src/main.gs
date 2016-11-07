function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('SMS')
  .addItem('Send','send')
  .addItem('Responses','responses')
  .addSeparator()
  .addItem('Settings', 'settings')
  .addItem('Help', 'help')
  .addToUi();
}

function settings_validate(){
  var props = PropertiesService.getDocumentProperties();
  var account = props.getProperty("ACCOUNT");
  if(account == null || account == "")
  {
    return false;
  }
  var token = props.getProperty("TOKEN");
  if(token == null || token == "")
  {
    return false;
  }
  var number = props.getProperty("NUMBER");
  if(number == null || number == "")
  {
    return false;
  }
  return true;
}

function send(){
   if(!settings_validate())
   {
      settings();
   }
   else
   {
      var ui =   SpreadsheetApp.getUi();
      var html = HtmlService.createTemplateFromFile('send')
      .evaluate()
      .setSandboxMode(HtmlService.SandboxMode.IFRAME)
      .setTitle('Send')
      .setWidth(300);
      ui.showSidebar(html);
  }
}

function help(){
      var ui =   SpreadsheetApp.getUi();
      var html = HtmlService.createTemplateFromFile('help')
      .evaluate()
      .setSandboxMode(HtmlService.SandboxMode.IFRAME)
      .setTitle('Help')
      .setWidth(300);
      ui.showSidebar(html);
}

function settings(){
  var ui =   SpreadsheetApp.getUi();
  var html = HtmlService.createTemplateFromFile('settings')
      .evaluate()
      .setSandboxMode(HtmlService.SandboxMode.IFRAME)
      .setTitle('Settings')
      .setWidth(300)
      ui.showSidebar(html);
}

function responses(){
   if(!settings_validate())
   {
      settings();
   }
   else
   {
     var ui =   SpreadsheetApp.getUi();
      var html = HtmlService.createTemplateFromFile('responses')
      .evaluate()
      .setSandboxMode(HtmlService.SandboxMode.IFRAME)
      .setTitle('Responses')
      .setWidth(300);
      ui.showSidebar(html);
   }
}

function history_new(){
   var ss = SpreadsheetApp.getActiveSpreadsheet();
   var historysheet = ss.getSheetByName("History");
   if(historysheet == null){
     historysheet = ss.insertSheet("History");
     historysheet.getRange(1, 1).setValue("Date");
     historysheet.getRange(1, 2).setValue("Type");
     historysheet.getRange(1, 3).setValue("Total");
     historysheet.getRange(1, 4).setValue("Cellphone column");
     historysheet.getRange(1, 5).setValue("Responses column");
     historysheet.getRange(1, 6).setValue("Comments");
     historysheet.getRange(1, 6).setValue("$ Aprox");
   }
}


function history_add(type, number,  params)
{
  var props = PropertiesService.getDocumentProperties();
  var history = props.getProperty("HISTORY");
  if(history){
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var historysheet = ss.getSheetByName("History");
    if(historysheet == null){
       history_new();
    }
    historysheet.insertRowAfter(1);
    var date = new Date();
    historysheet.getRange(2, 1).setValue(date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ":" + date.getMinutes());
    historysheet.getRange(2, 2).setValue(type);
    historysheet.getRange(2, 3).setValue(number);
    historysheet.getRange(2, 4).setValue(params.cellphones);
    historysheet.getRange(2, 5).setValue(params.responses);
    historysheet.getRange(2, 6).setValue(params.message);
    historysheet.getRange(2, 7).setValue(number * 0.0075);
  }
}

function send_send(params){
  var sheet =  SpreadsheetApp.getActiveSheet(); 
  var props = PropertiesService.getDocumentProperties();
  if(params.message == null || params.message == ""){
    throw new Error("Don't forget your message");
  }
  if(params.cellphones == null || params.cellphones == ""){
    throw new Error("We need those cellphones... please select a column");
  }
 
  if(params.reminder == true && (params.responses == null || params.responses == "")){
     throw new Error("You told me to not send if they already responded.. please select a column");
  }
  
  var lastrow = sheet.getLastRow();
  var cellphonesA1 = sheet.getName() + "!" + params.cellphones + "1:" + params.cellphones + lastrow;
  var cellphonesAx = sheet.getName() + "!" + params.cellphones;
  sheet.getRange(cellphonesA1).setFontColor("black");
  var cellphones = sheet.getRange(cellphonesA1).getValues();
  var responsesA1 = sheet.getName() + "!" + params.responses + "1:" + params.responses + lastrow;
  var responses = sheet.getRange(responsesA1).getValues();
  var date = new Date();
  
  props.setProperty("CELLPHONES", params.cellphones);
  props.setProperty("RESPONSES", params.responses);
  props.setProperty("REMINDER", params.reminder);
  props.setProperty("SINCE", date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate());
  
  var sent = 0;
  
  for(var i =0; i < cellphones.length ; i++)
  {
    var cell = cellphones[i][0];
    if(cell != null && cell != "" && !isNaN(parseInt(cell))){
      sheet.getRange(cellphonesAx + (i + 1)).setFontColor("black");
      if(params.reminder == true){
        if(responses[i][0] == null || responses[i][0] == ""){
          var response = send_sms(cell, params.message); 
          var code = response.getResponseCode();
          if(code == 200 || code == 201){
            sheet.getRange(cellphonesAx + (i + 1)).setFontColor("green");
            sent += 1;
          }
          else{
            sheet.getRange(cellphonesAx + (i + 1)).setFontColor("red");
          }
        }
        else{
          sheet.getRange(cellphonesAx + (i + 1)).setFontColor("blue");
        }         
      }
      else
      {
        
        var response = send_sms(cell, params.message);
        var code = response.getResponseCode();
        if(code == 200 || code == 201){
           sheet.getRange(cellphonesAx + (i + 1)).setFontColor("green");
           sent += 1;
          }
          else{
            sheet.getRange(cellphonesAx + (i + 1)).setFontColor("red");
          }
      }
    }
  }
  history_add("SEND", sent, params);
}

function responses_get(params){
  var sheet =  SpreadsheetApp.getActiveSheet(); 
 
  var props = PropertiesService.getDocumentProperties();
  var since = props.getProperty("SINCE");
  var cellphones = props.getProperty("CELLPHONES");
  var responses = props.getProperty("RESPONSES");
  
  if(params != null && params.cellphones != null && params.cellphones != ""){
     cellphones = params.cellphones;
  }
  if(params != null && params.since != null && params.since != ""){
     since = params.since;
  }
  if(params != null && params.responses != null && params.responses != ""){
    responses = params.responses;
  }
  
  var lastrow = sheet.getLastRow();
  var cellphonesA1 = sheet.getName() + "!" + params.cellphones + "1:" + params.cellphones + lastrow;
  var cellphonesAx = sheet.getName() + "!" + params.cellphones;
  var cellphones = sheet.getRange(cellphonesA1).getValues();
  var responsesA1 = sheet.getName() + "!" + params.responses + "1:" + params.responses + lastrow;
  var responsesAx = sheet.getName() + "!" + params.responses;
  sheet.getRange(responsesA1).setFontColor("black");
  var date = new Date();
  
  var messages = get_sms(since);
  var received = 0;
  
    for(var i=0; i < messages.length; i++){
      var body = messages[i].body;
      var cellphone = messages[i].from;
      for(var j =0; j < cellphones.length; j++){
        if(cellphone.indexOf(cellphones[j][0].toString()) >= 0){
          var result = sheet.getRange(responsesAx + (j+1));
          result.setValue(body);
          result.setFontColor("green");
          received += 1;
        }
      }
    }
  
  props.setProperty("SINCE", date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate());
  history_add("RECEIVE", received, params);
  
}

function get_sms(since){
   var props = PropertiesService.getDocumentProperties();
   var account = props.getProperty("ACCOUNT");
   var token = props.getProperty("TOKEN");
   var number = props.getProperty("NUMBER");
  
   if(since == null && since == ""){
     throw new Error("I can't bring you the whole list, please set a date");
   }
  
   var messages_url = "https://api.twilio.com/2010-04-01/Accounts/" + account + "/Messages.json/?";
   messages_url += "To=" + number;
   messages_url += "&DateSent>=" + since;
   messages_url = encodeURI(messages_url);
   var options= {
     "headers" : {
       "Authorization" : "Basic " + Utilities.base64Encode(account + ":" + token)
     }
   };
  var messages = [];
  do
  {
    var response = UrlFetchApp.fetch(messages_url, options);
    var content = response.getContentText();
    var json = JSON.parse(content);
    if(json.messages != null && json.messages.length > 0){
      messages = messages.concat(json.messages);
    }
    messages_url = json.next_page_uri;
  }
  while(messages_url != null);
  return messages;
}

function settings_update(params){
  var props = PropertiesService.getDocumentProperties();
  props.setProperty("ACCOUNT", params.account); 
  props.setProperty("TOKEN", params.token);
  props.setProperty("NUMBER", params.number);
  props.setProperty("HISTORY", params.history);
}

function send_sms(to, body) {
  
  var props = PropertiesService.getDocumentProperties();
  var account = props.getProperty("ACCOUNT");
  var token = props.getProperty("TOKEN");
  var number = props.getProperty("NUMBER");
  
  var messages_url = "https://api.twilio.com/2010-04-01/Accounts/" + account + "/Messages.json";
  var payload = {
    "To": to,
    "Body" : body,
    "From" : number
  };
 
  var options = {
    "method" : "post",
    "payload" : payload
  };
 
  options.headers = { 
    "Authorization" : "Basic " + Utilities.base64Encode(account + ":" + token)
  };
  var response = UrlFetchApp.fetch(messages_url, options);
  return response;
}
