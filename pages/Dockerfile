FROM node:lts-alpine

RUN apk add --no-cache git less curl

COPY package.json /package.json
# COPY package-lock.json /package-lock.json
RUN npm install --unsafe-perm

ADD . /
RUN npm run build
RUN grep -o '.../static/................................' build/index.html

FROM node:lts-alpine

RUN apk add --no-cache curl netcat-openbsd net-tools

COPY server/package.json /package.json
# COPY server/package-lock.json /package-lock.json
RUN npm install
COPY server/index.ts /index.ts
COPY --from=0 /build /build
CMD npm start
