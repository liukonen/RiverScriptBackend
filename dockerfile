FROM node:24.11.1-alpine3.22@sha256:54dfcc1bdf72fdd7f52499abfe58278b4ed7384124aef03707c5e36a94830562 AS build
WORKDIR /app
COPY package*.json ./
COPY . ./
RUN npm ci --omit=dev && npm cache clean --force

FROM node:24.11.1-alpine3.22@sha256:54dfcc1bdf72fdd7f52499abfe58278b4ed7384124aef03707c5e36a94830562 AS DEPLOYED
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
