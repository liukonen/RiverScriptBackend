const express = require("express")
const { getInfo } = require("./search.js")
const { botreply, isInformationQuery, extractQuery } = require("./brain.js")
const { GetWeather } = require("./weather.js")
const app = express()
const helmet = require("helmet")
const swaggerUi = require("swagger-ui-express")
const swaggerDocument = require("./openapi.json")
//Grpc
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');


//options
var options = {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "API Explorer",
    customfavIcon: "https://liukonen.dev/img/favicons/favicon-32x32.png"
}


//Middleware
app.use(helmet())
app.use(function (req, res, next) {
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
    const user = request.query.user || "local-user";
    const rawInput = request.query.text;

    if (!rawInput) {
        response.redirect("/api-docs");
        return;
    }

    const query = extractQueryString(rawInput);
    const result = await processQuery(query, user);

    response.json({ response: result });
}

function extractQueryString(rawInput) {
    const query = rawInput.toLowerCase().trim();
    // Perform any necessary extraction or manipulation of the query here
    return query;
}

async function processQuery(query, user) {
    if (query.includes("weather")) {
        try {
            const weather = await GetWeather();
            return weather;
        } catch (exception) {
            return (
                "For some reason, I can't lookup the weather... odd. I'm indoors, so it doesn't matter to me anyway."
            );
        }
    } else if (isInformationQuery(query)) {
        const searchResult = await getInfo(query);
        if (searchResult) {
            return searchResult;
        }
    } else {
        const filteredInput = query.replace(/['"]+/g, "");
        return botreply(user, filteredInput);
    }
}

//Routes
app.get("/api-docs", swaggerUi.setup(swaggerDocument, options))

app.get('/docs/swagger.json', (req, res) => {
    res.sendFile('openapi.json', { root: '.' });
})

app.use('/healthcheck', require('express-healthcheck')({
    healthy: function () {
        return { everything: 'is ok' }
    }
}))

app.use("/", handleRequest)


//Server
var server = app.listen(process.env.PORT || 5000, function () {
    var port = server.address().port
    console.log("Express is working on port " + port)
})

//Load
// const protoPath = './message.proto'; // Replace with the actual path to your proto file
// const packageDefinition = protoLoader.loadSync(protoPath);
// const protoPackage = grpc.loadPackageDefinition(packageDefinition).bot;
// const grpcClient = new protoPackage.BotService("50051", grpc.credentials.createInsecure());

const packageDefinition = protoLoader.loadSync('./message.proto', {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
const botService = protoDescriptor.bot.BotService;

const grpcServer = new grpc.Server();

grpcServer.addService(botService.service, {
  HandleRequest: handlegrpcRequest,
});

function handlegrpcRequest(call, callback) {
  const { user, text } = call.request;
  const query = extractQueryString(text);
  processQuery(query, user)
    .then((result) => {
      const response = { response: result };
      callback(null, response);
    })
    .catch((error) => {
      console.error('Error processing request:', error);
      callback(error);
    });
}

// Start the gRPC server
const port = 50051; // Choose the desired port for your gRPC server
const serverAddress = `0.0.0.0:${port}`;
grpcServer.bindAsync("localhost:50051", grpc.ServerCredentials.createInsecure(), (error, port) => {
  if (error) {
    console.error('Failed to bind gRPC server:', error);
    process.exit(1);
  }
  console.log(`gRPC server is running on ${serverAddress}`);
  grpcServer.start();
});