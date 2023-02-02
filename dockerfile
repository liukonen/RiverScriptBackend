FROM golang:alpine AS build

WORKDIR /app

COPY go.mod ./
COPY go.sum ./
RUN go mod download

COPY *.go ./
COPY *.rive ./
ADD /static /app/static
RUN go build -o /docker-gs-ping


## Deploy
FROM alpine:latest
WORKDIR /
COPY --from=build /docker-gs-ping /docker-gs-ping
COPY *.rive /
ADD /static /static
EXPOSE 5000
ENTRYPOINT ["/docker-gs-ping"]
