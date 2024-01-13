const express = require("express")
const { getInfo } = require("./search.js")
const { botreply, isInformationQuery, extractQuery } = require("./brain.js")
const { GetWeather } = require("./weather.js")
const app = express()
const helmet = require("helmet")
const swaggerUi = require("swagger-ui-express")
const config = require("./config.js")
const swaggerJSDoc = require("swagger-jsdoc")


const currentDate = new Date();
const formattedDate = currentDate.toISOString().split('T')[0].replace(/-/g, '');
const version = `1.${formattedDate}`;

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info:{
        title: "RiverScript Bot",
    description: "This API is used for the RiverScript Bot at Chat.liukonen.dev. The source code to this bot is open source and available for anyone to use. I am leaving this open frealy for anyone to use if they want to play around. I do ask th following. <br/>1. do not use the bot for any spaming, spoofing or any malice <br/>2. do not bombard or DNS attack the bot. This is running on a Raspbery Pi <br />3. Understand some of the responses I have no control over, and content, links or data provided by the bot may come from 3rd party sources such as Duck Duck Go and NOAA. <br/> <b>In general, don't be evil, and be kind to the bot</b>",
    version: version,
    termsOfService: "https://github.com/liukonen/liukonen.github.io/blob/master/LICENSE",
    contact: {email: "liukonen@gmail.com"},
    license: {name: "MIT",url: "https://github.com/liukonen/RiverScriptBackend/blob/Main/LICENSE"}
    }},
    servers: [
        {
            url: 'https://bot.liukonen.dev',
            description: 'Raspberry Pi server'
        }],
    apis: ['index.js'], // Point to the file containing your API routes
  };

  const swaggerSpec = swaggerJSDoc(swaggerOptions);

  app.use(config.paths.swagger, swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//Middleware
app.use(helmet())
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", config.corsOptions.allowedOrigin)
    res.header("Access-Control-Allow-Headers", config.corsOptions.allowedHeaders)
    next()
})

/**
 * @swagger
 * /:
 *   get:
 *     summary: Talks to the chatbot.
 *     parameters:
 *       - in: query
 *         name: text
 *         schema:
 *           type: string
 *         description: The String representation of what you'd like to ask the Chatbot.
 *     responses:
 *       200:
 *         description: The response of the chat bot.
 */
app.use(config.paths.swagger, swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.use(config.paths.health, require('express-healthcheck')({ healthy: () => ({ everything: config.isOk }) }));
app.use(config.paths.base, handleRequest)

//Route Handlers
async function handleRequest(request, response) {
    const user = request.query.user || "local-user"
    const rawInput = request.query.text
    if (!rawInput) {
        response.redirect(config.paths.swagger)
        return
    }
    let query = rawInput.toLowerCase().trim()
    if (query.includes("weather")) {
        const weather = await GetWeather()
        response.json({ response: weather })
    } else if (isInformationQuery(query)) {
        const searchResult = await getInfo(extractQuery(query))
        response.json({ response: searchResult })
    } else {
        const filteredInput = rawInput.replace(/['"]+/g, '')
        botreply(user, filteredInput).then(reply => {
            response.json({ response: reply })
        })
    }
}



//Server
var server = app.listen(process.env.PORT || 5000, function () {
    var port = server.address().port
    console.log("Express is working on port " + port)
})