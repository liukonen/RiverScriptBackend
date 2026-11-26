FROM node:26-slim@sha256:abe7e5a82b61a8ef67b315b85497c9e65173387ccf2f4a029248184b8e020be5 AS build
WORKDIR /app
COPY package*.json ./
COPY . ./
RUN npm ci --omit=dev && npm cache clean --force

FROM gcr.io/distroless/nodejs26-debian13:nonroot@sha256:a84242e747fbb5aaaa0180c273b6f7130ca34b3300082192ef58eea96089eb3c AS DEPLOYED
WORKDIR /app
LABEL maintainer="Luke Liukonen <liukonen@gmail.com>" \
      org.opencontainers.image.title="RiverScriptBackend" \
      org.opencontainers.image.description="A lightweight ChatBot application." \
      org.opencontainers.image.version="1.0.0" \
      org.opencontainers.image.licenses="MIT"
COPY --from=build /app /app

EXPOSE 5000
ENTRYPOINT ["/nodejs/bin/node", "index.mjs"]
