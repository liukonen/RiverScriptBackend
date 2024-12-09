FROM node:lts-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --production && npm cache clean --force
COPY . ./

FROM node:lts-alpine AS DEPLOYED
WORKDIR /app
LABEL maintainer="Luke Liukonen <liukonen@gmail.com>" \
      org.opencontainers.image.title="RiverScriptBackend" \
      org.opencontainers.image.description="A lightweight ChatBot application." \
      org.opencontainers.image.version="1.0.0" \
      org.opencontainers.image.licenses="MIT"
COPY --from=build /app /app
USER 1000
EXPOSE 5000
CMD ["node", "index.js"]