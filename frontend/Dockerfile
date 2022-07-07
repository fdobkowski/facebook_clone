FROM node:alpine as builder

WORKDIR /opt/app

COPY ./package.json ./
COPY ./yarn.lock ./

RUN yarn install

COPY ./ ./

CMD yarn start
