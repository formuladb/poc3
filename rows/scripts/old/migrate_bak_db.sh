set -ex
. `dirname $0`/fct_utils.sh

fctCreate_bak_db() {
    psql -h db -U postgres -c 'DROP DATABASE bak' || true
    psql -v ON_ERROR_STOP=1 -h db -U postgres -c 'CREATE DATABASE bak WITH TEMPLATE frmdb'

    if [ -d "/bak-db/pg_dump.dir" ]; then
        time pg_restore -j3 -h db -U postgres -d bak --clean -Fd /bak-db/pg_dump.dir || true
    elif [ -f "/bak-db/pg_dump.sql.gz" ]; then
        zcat /bak-db/pg_dump.sql.gz | time psql -h db -U postgres -d bak
    fi
}

fctInit
fctCreate_bak_db
