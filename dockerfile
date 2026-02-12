FROM node:24.13.1-alpine3.22@sha256:d922a9e03df81e73081dbf73566c7e9aa5b96283000d0103a3be94976b138c16 AS build
WORKDIR /app
COPY package*.json ./
COPY . ./
RUN npm ci --omit=dev && npm cache clean --force

FROM node:24.13.1-alpine3.22@sha256:d922a9e03df81e73081dbf73566c7e9aa5b96283000d0103a3be94976b138c16 AS DEPLOYED
WORKDIR /app
LABEL maintainer="Luke Liukonen <liukonen@gmail.com>" \
      org.opencontainers.image.title="RiverScriptBackend" \
      org.opencontainers.image.description="A lightweight ChatBot application." \
      org.opencontainers.image.version="1.0.0" \
      org.opencontainers.image.licenses="MIT"
COPY --from=build /app /app
USER 1000:1000
EXPOSE 5000
CMD ["node", "index.mjs"]
