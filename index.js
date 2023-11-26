const express = require("express")
const { getInfo } = require("./search.js")
const { botreply, isInformationQuery, extractQuery } = require("./brain.js")
const { GetWeather } = require("./weather.js")
const app = express()
const helmet = require("helmet")
const swaggerUi = require("swagger-ui-express")
const swaggerDocument = require("./openapi.json")
const config = require("./config.js")

//Middleware
app.use(helmet())
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", config.corsOptions.allowedOrigin)
    res.header("Access-Control-Allow-Headers", config.corsOptions.allowedHeaders)
    next()
})
app.use(config.paths.swagger, swaggerUi.serve)
app.use(config.paths.health, require('express-healthcheck')({ healthy: () => ({ everything: config.isOk }) }));
app.use(config.paths.base, handleRequest)

//Route Handlers
async function handleRequest(request, response) {
    const user = request.query.user || "local-user"
    const rawInput = request.query.text
    if (!rawInput) {
        response.redirect("/api-docs")
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

//Routes
app.get(config.paths.swagger, swaggerUi.setup(swaggerDocument, config.swaggerUiOptions))
app.get(config.paths.swaggerDoc, (req, res) => res.sendFile('openapi.json', { root: '.' }))

//Server
var server = app.listen(process.env.PORT || 5000, function () {
    var port = server.address().port
    console.log("Express is working on port " + port)
})