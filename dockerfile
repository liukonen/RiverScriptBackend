FROM node:lts-alpine AS build
WORKDIR /app
COPY *.json .
RUN npm ci --only=production
COPY . .

FROM node:lts-alpine
WORKDIR /app
COPY --from=build /app /app
USER 1000
EXPOSE 5000
CMD ["index.js"]