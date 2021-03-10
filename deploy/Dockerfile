FROM node:lts-alpine

RUN apk add --no-cache postgresql-client \
    git vim openssh \
    curl \
    netcat-openbsd \
    less \
    net-tools \
    rsync \
    jq \
    bash

ADD ./ssh /ssh
RUN chmod 700 /ssh
RUN chmod 644 /ssh/frmdb.id_rsa.pub
RUN chmod 600 /ssh/frmdb.id_rsa

COPY package.json /package.json
RUN npm install

COPY frmdb /frmdb
COPY scripts /scripts
COPY scripts/migrate-db.sh /scripts/migrate-db.sh
COPY src /src

RUN mkdir -p /deployment/db
CMD npm run dev
