FROM node:24.15.0-alpine3.22@sha256:71b5802142515f69d9f5eb2ac283fb73118f1cbe0bbe4941bb34bd924940038f AS build
WORKDIR /app
COPY package*.json ./
COPY . ./
RUN npm ci --omit=dev && npm cache clean --force

FROM node:24.15.0-alpine3.22@sha256:71b5802142515f69d9f5eb2ac283fb73118f1cbe0bbe4941bb34bd924940038f AS DEPLOYED
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
