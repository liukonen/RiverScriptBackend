FROM node:lts-alpine AS build
WORKDIR /app
COPY *.json ./
RUN npm ci --production
COPY . ./
RUN npm prune

FROM node:lts-alpine AS DEPLOYED
WORKDIR /app
COPY --from=build /app /app
USER 1000
EXPOSE 5000
CMD ["node", "index.js"]