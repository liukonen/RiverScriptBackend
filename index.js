

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
  
  bot.reply(user, input).then(function(reply) {
    response.json({response: reply});  
  });
});

bot.loadFile("rs-standard.rive").then(loading_done).catch(loading_error);
app.listen(process.env.port || "3000");