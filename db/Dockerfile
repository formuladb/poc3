FROM registry.gitlab.com/pagerows/pagerows/dbivm:14

FROM postgres:10-alpine

ENV PGTAP_VERSION v1.2.0

RUN apk -U add \
    alpine-sdk \
    perl \
 && git clone https://github.com/theory/pgtap \
 && cd pgtap \
 && git checkout ${PGTAP_VERSION} \
 && make \
 && make install

FROM registry.gitlab.com/pagerows/pagerows/dbivm:14

COPY --from=0 /usr/local/share/postgresql/extension/pgtap* /usr/local/share/postgresql/extension/

RUN apk -U add \
    build-base \
    perl-dev \
 && cpan TAP::Parser::SourceHandler::pgTAP \
 && apk del -r build-base
