FROM node:24.13.0-alpine3.22@sha256:ba1b0e8d56cfb8802a2c0532598d19f6550a4d11d83ea5a5aecffb81c690bd32 AS build
WORKDIR /app
COPY package*.json ./
COPY . ./
RUN npm ci --omit=dev && npm cache clean --force

FROM node:24.13.0-alpine3.22@sha256:ba1b0e8d56cfb8802a2c0532598d19f6550a4d11d83ea5a5aecffb81c690bd32 AS DEPLOYED
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
