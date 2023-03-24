FROM node:alpine

RUN mkdir -p /usr/app

WORKDIR /usr/app

RUN apk add --no-cache bash
RUN apk add --no-cache chromium

COPY package*.json .

RUN npm install


COPY . .

RUN npm run build

EXPOSE 3000

CMD npm run start

