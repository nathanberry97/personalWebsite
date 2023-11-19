# Create build
FROM node:hydrogen-alpine AS build

RUN apk update && apk --no-cache upgrade

WORKDIR /build

COPY ./app/src ./src
COPY ./app/package.json ./
COPY ./app/tsconfig.json ./

RUN npm install
RUN npm run build

# Create final image
FROM build

WORKDIR /app

COPY ./app/.env /app/
COPY ./app/html/ /app/html/
COPY --from=build /build/lib/ /app/lib/
COPY --from=build /build/node_modules/ /app/node_modules/

CMD ["node", "/app/lib/main.js"]
