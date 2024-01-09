module.exports = {
    swaggerUiOptions: {
        customCss: ".swagger-ui .topbar { display: none }",
        customSiteTitle: "API Explorer",
        customfavIcon: "https://liukonen.dev/img/favicons/favicon-32x32.png"
    },
    corsOptions: {
        allowedOrigin: ["https://liukonen.dev", "https://bot.liukonen.dev"],
        allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept"
    },
    paths: {
        base: "/",
        swagger: "/api-docs",
        swaggerDoc: "/docs/swagger.json",
        health: "/healthcheck"

    },
    defaultUser: "local-user",
    isOk: "is ok",
}