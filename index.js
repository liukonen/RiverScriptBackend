const express = require("express")
const { getInfo } = require("./search.js")
const { botreply, isInformationQuery, extractQuery } = require("./brain.js")
const { GetWeather } = require("./weather.js")
const app = express()
const helmet = require("helmet")
const Redoc = require("redoc-express")
const swaggerUi = require("swagger-ui-express")
const swaggerDocument = require("./openapi.json")
const { default: RiveScript } = require("rivescript")

//options
var redocOptions = {
    title: "API Explorer",
    theme: {
        typography: {
            fontFamily: "Roboto, sans-serif",
            fontSize: "16px"
        },
        colors: {
            primary: {
                main: "#2c3e50"
            }
        }
    },
};


//Middleware
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://unpkg.com"]
    }
}));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "https://liukonen.dev")
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    )
    next()
})
app.use("/api-docs", swaggerUi.serve)

//Route Handlers
async function handleRequest(request, response) {
    const user = request.query.user || "local-user"
    const rawInput = request.query.text

    if (!rawInput) {
        response.redirect("/api-docs")
        return
    }

    let query = rawInput.toLowerCase().trim()

    if (query.includes("weather"))
        try {
            const weather = await GetWeather()
            response.json({ response: weather })
        }
    catch (exception) {
        response.json({
            response: "For some reason, I can't lookup the weather... odd. I'm indoors, so it doesn't matter to me anyway."
        })
    } else if (isInformationQuery(query)) {
        query = extractQuery(query)
        const searchResult = await getInfo(query)
        if (searchResult) {
            response.json({ response: searchResult })
        }
    } else {
        const filteredInput = rawInput.replace(/['"]+/g, '')
        botreply(user, filteredInput).then(reply => {
            response.json({ response: reply })
        })
    }
}

var options = {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "API Explorer",
    customfavIcon: "https://liukonen.dev/img/favicons/favicon-32x32.png"
}

//Routes
app.get("/api-docs", swaggerUi.setup(swaggerDocument, options))

app.get('/docs/swagger.json', (req, res) => {
    res.sendFile('openapi.json', { root: '.' });
})

app.get(
    '/docs',
    Redoc({
        title: 'API Docs',
        specUrl: '/docs/swagger.json',
        redocOptions: {
            theme: {
                colors: {
                    primary: {
                        main: '#6EC5AB'
                    }
                },
                typography: {
                    fontFamily: `"museo-sans", 'Helvetica Neue', Helvetica, Arial, sans-serif`,
                    fontSize: '15px',
                    lineHeight: '1.5',
                    code: {
                        code: '#87E8C7',
                        backgroundColor: '#4D4D4E'
                    }
                },
                menu: {
                    backgroundColor: '#ffffff'
                }
            }
        }
    })
)

app.use('/healthcheck', require('express-healthcheck')({
    healthy: function() {
        return { everything: 'is ok' }
    }
}))

app.use("/", handleRequest)


//Server
var server = app.listen(process.env.PORT || 5000, function() {
    var port = server.address().port
    console.log("Express is working on port " + port)
})