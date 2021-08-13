FROM node:lts-alpine

RUN apk add --no-cache postgresql-client git vim openssh curl entr make \
    netcat-openbsd less net-tools rsync jq bash findutils

COPY package.json /package.json
RUN npm install

ADD scripts /scripts
RUN chmod +x /scripts/*sh

ADD pg /pg
ADD src /src

CMD npm start
