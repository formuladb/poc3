ARG CORE
FROM $CORE


FROM node:lts-alpine

RUN apk add --no-cache postgresql-client git vim openssh curl entr make \
    netcat-openbsd less net-tools rsync jq bash findutils grep
RUN mkdir rows
COPY package.json /package.json
RUN npm install

COPY tsconfig.json /tsconfig.json

ADD scripts /scripts
RUN chmod +x /scripts/*sh

ADD pg /pg
ADD src /src

COPY --from=0 /src-core /src/src-core
RUN sed -i -e 's!../pages/src/core/!./src/src-core/!' tsconfig.json
RUN cat tsconfig.json
RUN ls -l /src/src-core/entity

CMD npm start
