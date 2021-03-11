FROM alpine:3.13.1

RUN apk add --no-cache postgresql-client git vim openssh curl \
    netcat-openbsd less net-tools rsync jq bash

RUN mkdir /frmdb
ADD . /frmdb/

COPY create-frmdb-db.sh /create-frmdb-db.sh
