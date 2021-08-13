FROM node:lts-alpine

RUN apk add --no-cache postgresql-client git vim openssh curl entr make \
    netcat-openbsd less net-tools rsync jq bash findutils

COPY package.json /package.json
RUN npm install

COPY tsconfig.json /tsconfig.json
COPY ormconfig.js /ormconfig.js

ADD scripts /scripts
RUN chmod +x /scripts/*sh

ADD pg /pg
ADD src /src

CMD npm start
