const express = require("express");
const { GetInfo } = require("./search.js");
const { botreply } = require("./brain.js");
const { GetWeather } = require("./weather.js");
const app = express();
const helmet = require("helmet");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./openapi.json");

var options = {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "API Explorer",
    customfavIcon: "https://liukonen.dev/img/favicons/favicon-32x32.png"
};
app.use(helmet());

function remove(text, toremove) {
    let tempText = text;
    while (tempText.includes(toremove)) {
        tempText = tempText.replace(toremove, "");
    }
    return tempText;
}

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "https://liukonen.dev");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

app.get("/", async(request, response) => {
    let user = request.query.user;
    if (user === "undefined") {
        user = "local-user";
    }

    let rawInput = request.query.text;
    if (typeof rawInput === "undefined") {
        response.redirect("/api-docs");
    } else {
        let query = rawInput.toLowerCase();
        if (query.includes("weather")) {
            try {
                let weather = await GetWeather();
                response.json({ response: weather });
            } catch (exception) {
                response.json({
                    response: "For some reason, I can't lookup the weather... odd. I'm indoors, so it doesn't matter to me anyway."
                });
            }
        } else if (
            query.includes("who's") ||
            query.includes("who is") ||
            query.includes("tell me about") ||
            query.includes("what is")
        ) {
            let ln = 0;
            let testLN = 1;
            while (testLN != ln) {
                ln = query.length;
                query = query
                    .replace("who's", "")
                    .replace("who is", "")
                    .replace("tell me about", "")
                    .replace("what is", "");
                testLN = query.length;
            }
            let searchResult = await GetInfo(query);
            if (searchResult != "") {
                response.json({ response: searchResult });
            }
        } else {
            rawInput = remove(rawInput, '"');
            botreply(user, rawInput).then(function(reply) {
                response.json({ response: reply });
            });
        }
    }
});


app.use("/api-docs", swaggerUi.serve);
app.get("/api-docs", swaggerUi.setup(swaggerDocument, options));

var server = app.listen(process.env.PORT || 5000, function() {
    var port = server.address().port;
    console.log("Express is working on port " + port);
});