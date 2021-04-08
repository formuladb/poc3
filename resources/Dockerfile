FROM node:lts-alpine

RUN apk add --no-cache curl netcat-openbsd net-tools

COPY package.json /package.json
RUN npm install

COPY index.ts /index.ts

CMD npm start
