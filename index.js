const express = require("express");
const RiveScript = require("rivescript");
const NodeCache = require("node-cache");
const dit = require("node-duckduckgo");
const axios = require('axios').default;
const myCache = new NodeCache();
const app = express();
const bot = new RiveScript();
const helmet = require("helmet");
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./openapi.json');

var options  = {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "API Explorer",
  customfavIcon: "https://liukonen.dev/img/favicons/favicon-32x32.png"
};
app.use(helmet());

function loading_done() {
  console.log("Bot has finished loading!");
  bot.sortReplies();
}

function loading_error(error, filename, lineno) {
  console.log("Error when loading files: " + error);
}

async function GetWeather() {
  let value = myCache.get("weather");
  if (value == undefined) {

    let js = await axios({
      method: 'get',
      url: 'https://api.weather.gov/gridpoints/MKX/80,70/forecast',
      responseType: 'json'
    });

    let textvalue = js.data.properties.periods[0].detailedForecast;
    console.log(textvalue);
    value =
      "I'm not sure where you live, but in Milwaukee, we are looking at " +
      textvalue;
    myCache.set("weather", value, 3600);
  }
  return value;
}

async function GetInfo(request) {
  let result = await dit.duckIt(request, { noHtml: true });
  if (result.data.AbstractText != "") {
    return "I found on Duck Duck go, that " + result.data.AbstractText;
  } else if (result.data.AbstractURL != "") {
    return (
      "I found something from Duck Duck Go on " +
      result.data.AbstractSource +
      " " +
      result.data.Heading +
      " " +
      result.data.AbstractURL
    );
  }
  return result.data.AbstractSource;
}

function remove(text, toremove) {
  let tempText = text;
  while (tempText.includes(toremove)) {
    tempText = tempText.replace(toremove, "");
  }
  return tempText;
}

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "https://liukonen.dev");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/", async (request, response) => {
  let user = request.query.user;
  if (user === "undefined") {
    user = "local-user";
  }

  let input = request.query.text;
  if (typeof input === "undefined") {
    response.redirect('/api-docs');
  } else {
    let lInput = input.toLowerCase();
    if (lInput.includes("weather")) {
      let weather = await GetWeather();
      response.json({ response: weather });
    } else if (
      lInput.includes("who's") ||
      lInput.includes("who is") ||
      lInput.includes("tell me about") ||
      lInput.includes("what is")
    ) {
      let ln = 0;
      let testLN = 1;
      while (testLN != ln) {
        ln = lInput.length;
        lInput = lInput
          .replace("who's", "")
          .replace("who is", "")
          .replace("tell me about", "")
          .replace("what is", "");
        testLN = lInput.length;
      }
      let searchResult = await GetInfo(lInput);
      if (searchResult != "") {
        response.json({ response: searchResult });
      }
    } else {
      input = remove(input, '"');
      bot.reply(user, input).then(function (reply) {
        response.json({ response: reply });
      });
    }
  }
});

app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerDocument, options));

bot.loadFile("rs-standard.rive").then(loading_done).catch(loading_error);

var server = app.listen(process.env.PORT || 5000, function () {
  var port = server.address().port;
  console.log("Express is working on port " + port);
});
