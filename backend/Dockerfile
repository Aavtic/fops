# Build stage
FROM golang:1.25 AS build-stage
WORKDIR /app

COPY ./server/go.mod ./server/go.sum ./
RUN go mod download

COPY ./server/ .
RUN CGO_ENABLED=0 GOOS=linux go build -o /fops-server cmd/main.go

# Deployment
FROM gcr.io/distroless/base-debian12
WORKDIR /

COPY --from=build-stage /fops-server /fops-server

USER nonroot:nonroot
EXPOSE 8080

ENTRYPOINT ["/fops-server"]
