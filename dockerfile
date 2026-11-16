FROM node:26-slim@sha256:e6bedef217677b276c591795e169840edd9096dbf13f29df8ef8d1856b8820bc AS build
WORKDIR /app
COPY package*.json ./
COPY . ./
RUN npm ci --omit=dev && npm cache clean --force

FROM gcr.io/distroless/nodejs26-debian13:nonroot@sha256:1d736cf8b5716c07a245301f92717143215d248fd55771ee1936ef4b3302e531 AS DEPLOYED
WORKDIR /app
LABEL maintainer="Luke Liukonen <liukonen@gmail.com>" \
      org.opencontainers.image.title="RiverScriptBackend" \
      org.opencontainers.image.description="A lightweight ChatBot application." \
      org.opencontainers.image.version="1.0.0" \
      org.opencontainers.image.licenses="MIT"
COPY --from=build /app /app

EXPOSE 5000
ENTRYPOINT ["/nodejs/bin/node", "index.mjs"]
