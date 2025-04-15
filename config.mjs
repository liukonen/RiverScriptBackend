export const swaggerUiOptions = {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "API Explorer",
    customfavIcon: "https://liukonen.dev/img/favicons/favicon-32x32.png"
};

export const corsOptions = {
    allowedOrigin: "https://liukonen.dev",
    allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept"
};

export const paths = {
    base: "/",
    swagger: "/api-docs",
    swaggerDoc: "/docs/swagger.json",
    health: "/healthcheck"
};

export const defaultUser = "local-user";
export const isOk = "is ok";
