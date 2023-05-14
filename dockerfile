FROM node:lts-alpine AS build
RUN if [ -n "$npm_config_proxy" ]; then \
      npm config set proxy $npm_config_proxy && \
      npm config set https-proxy $npm_config_proxy \
    ; fi
WORKDIR /app
COPY *.json ./
RUN npm ci --production
COPY . ./
RUN npm prune

FROM node:lts-alpine
WORKDIR /app
COPY --from=build /app /app
USER 1000
EXPOSE 5000
CMD ["index.js"]
