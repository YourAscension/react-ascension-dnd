FROM alpine:latest

RUN apk update

RUN apk add nodejs

RUN apk add npm

WORKDIR /app

COPY package.json .

RUN npm install

EXPOSE 3000

ENTRYPOINT ["npm", "start"]