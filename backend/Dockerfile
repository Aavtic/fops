# Build stage

FROM golang:1.25 AS build-stage

WORKDIR /app

COPY ./server/go.mod ./server/go.sum ./

RUN go mod download

COPY ./server/ .

RUN CGO_ENABLED=0 GOOS=linux go build -o /fops-server cmd/main.go

# Build Deployment stage

FROM gcr.io/distroless/base-debian11 AS build-release-stage

WORKDIR /

COPY --from=build-stage /fops-server /fops-server

EXPOSE 8080

USER nonroot:nonroot

ENTRYPOINT ["./fops-server"]
