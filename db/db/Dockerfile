FROM registry.gitlab.com/pagerows/pagerows/dbivm:14 AS ext

ENV PGTAP_VERSION v1.2.0

RUN apk -U add \
    alpine-sdk \
    perl \
    git \
    patch

RUN set -eux; git clone https://github.com/theory/pgtap \
 && cd pgtap \
 && git checkout ${PGTAP_VERSION} \
 && make \
 && make install

RUN set -eux; git clone https://github.com/michelp/pgjwt.git; \
	cd pgjwt && make install;


FROM registry.gitlab.com/pagerows/pagerows/dbivm:14

ENV PAGER=less

COPY --from=ext /usr/local/share/postgresql/extension/pgtap* /usr/local/share/postgresql/extension/
COPY --from=ext /usr/local/share/postgresql/extension/pgjwt* /usr/local/share/postgresql/extension/

RUN apk add --no-cache less strace lsof net-tools iotop sysstat
