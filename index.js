

const express = require("express");
const RiveScript = require("rivescript");
const app = express();
const bot = new RiveScript();

function loading_done() {
  console.log("Bot has finished loading!");
  bot.sortReplies();
}

function loading_error(error, filename, lineno) {
  console.log("Error when loading files: " + error);
}

function remove(text, toremove){
  let tempText = text;
  while (tempText.includes(toremove)){
    tempText = tempText.replace(toremove, '');
  }
  return tempText;
}



app.get("/", async(request, response) => {
  let user = request.query.user;
  if (user === 'undefined'){user = "local-user";}
  
  let input = request.query.text;
  input = remove(input, '\"');
  
  if(input === 'undefined') response.json({response: "You need to give me input.. such as ?user='luke'&text='hi'"});

  bot.reply(user, input).then(function(reply) {
    response.json({response: reply});  
  });
});

bot.loadFile("rs-standard.rive").then(loading_done).catch(loading_error);

var server = app.listen(process.env.PORT || 5000, function () {
  var port = server.address().port;
  console.log("Express is working on port " + port);
});

//app.listen(process.env.PORT || 3000);
