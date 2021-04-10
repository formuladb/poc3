FROM node:lts-alpine

RUN apk add --no-cache postgresql-client git vim openssh curl entr \
    netcat-openbsd less net-tools rsync jq bash

COPY package.json /package.json
RUN npm install

COPY index.ts /index.ts

ADD scripts /scripts
RUN chmod +x /scripts/*sh

ADD sql /sql/

CMD npm start
