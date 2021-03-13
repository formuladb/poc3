FROM alpine:3.13.1

RUN apk add --no-cache postgresql-client git vim openssh curl \
    netcat-openbsd less net-tools rsync jq bash

RUN curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
# RUN curl -LO "https://dl.k8s.io/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl.sha256"
# RUN echo "$(<kubectl.sha256) kubectl" | sha256sum --check

RUN chmod u+x kubectl && mv kubectl /bin/kubectl
RUN kubectl version --client

