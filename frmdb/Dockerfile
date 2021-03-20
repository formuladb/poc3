FROM alpine:3.13.1

RUN apk add --no-cache postgresql-client git vim openssh curl entr \
    netcat-openbsd less net-tools rsync jq bash

RUN mkdir /frmdb
ADD . /frmdb/

COPY utils.sh /utils.sh
COPY frmdb.sh /frmdb.sh
