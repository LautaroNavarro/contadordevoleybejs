FROM node:alpine3.12

WORKDIR /srv/contadordevoleybe/

COPY ./package.json ./

RUN npm install

COPY ./src ./
