const express = require("express");
const RiveScript = require("rivescript");
const request = require('request');
const NodeCache = require( "node-cache" );
const noaaWeather = require('noaa-weather');
const dit = require("node-duckduckgo");
const { response } = require("express");

const myCache = new NodeCache();
const app = express();
const bot = new RiveScript();

function loading_done() {
  console.log("Bot has finished loading!");
  bot.sortReplies();
}

function loading_error(error, filename, lineno) {
  console.log("Error when loading files: " + error);
}


async function GetWeather(){
  let value = myCache.get( "weather" );
  if ( value == undefined ){
      let X = await noaaWeather('Milwaukee, WI');
      value = "Im not sure where you live, but in Milwaukee, we are looking at " + X.data.text[0];
      success = myCache.set( "weather", value, 3600);
  }
  return value;
}


async function GetInfo(request){
  let result = await dit.duckIt(request, { noHtml: true });
  if (result.data.AbstractText != ""){
    return "I found on Duck Duck go, that " + result.data.AbstractText
  }else if(result.data.AbstractSource != ""){
    return "I found something from Duck Duck Go on " + result.data.AbstractSource + " " + result.data.Heading + " " + result.data.AbstractURL;
  }
  return result.data.AbstractSource;
}

async function BotCall(request){
  let input = remove(request, '\"');
  let response = await bot.reply(user, input);
  return response;
}

function remove(text, toremove){
  let tempText = text;
  while (tempText.includes(toremove)){
    tempText = tempText.replace(toremove, '');
  }
  return tempText;
}

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get("/", async(request, response) => {
  let user = request.query.user;
  if (user === 'undefined'){
    user = "local-user";
  }
  
  let input = request.query.text;
  if(typeof input === 'undefined') {
    response.json({response: "You need to give me input.. such as ?user='luke'&text='hi'"});
  } else {
    let lInput = input.toLowerCase();
    if (lInput.includes("weather")){
      let weather = await GetWeather();
      response.json({response: weather}); 
    }
    else if(lInput.includes("who's") || lInput.includes("who is") || lInput.includes("tell me about") || lInput.includes("what is")){
      let ln = 0;
      let testLN = 1;
      while (testLN != ln){
        ln = lInput.length;
        lInput = lInput.replace("who's", "").replace("who is", "").replace("tell me about", "").replace("what is", "");
        testLN = lInput.length;
      }
      let searchResult = await GetInfo(lInput);
      if (searchResult != ""){response.json({response: searchResult});}
    }
      input = remove(input, '\"');
      bot.reply(user, input).then(function(reply) {
        response.json({response: reply});  
      });
    
  }
});

bot.loadFile("rs-standard.rive").then(loading_done).catch(loading_error);

var server = app.listen(process.env.PORT || 5000, function () {
  var port = server.address().port;
  console.log("Express is working on port " + port);
});
//app.listen(process.env.PORT || 3000);