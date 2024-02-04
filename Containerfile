# Create build
FROM --platform=linux/amd64 golang:1.21.6-alpine3.19 AS build

WORKDIR /build

COPY ./apod/go.mod ./
COPY ./apod/go.sum ./
RUN go mod download

COPY ./apod/src/ ./src/
RUN go build -o ./bin/apod ./src/*.go

# Create final image
FROM build

WORKDIR /app

COPY ./apod/.env ./
COPY ./apod/template.html ./
COPY --from=build /build/bin/ /app/bin/

CMD ["/app/bin/apod"]
