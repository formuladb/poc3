set -ex
. `dirname $0`/fct_utils.sh

fctCreate_bak_db() {
    until psql -h db -U postgres -lqt | cut -d \| -f 1 | grep -qw bak; do 
        psql -h db -U postgres -c 'DROP DATABASE bak' || true
        psql -v ON_ERROR_STOP=1 -h db -U postgres -c 'CREATE DATABASE bak WITH TEMPLATE frmdb'
        sleep 2; 
    done

    if [ -d "/deploy/00_pg_dump.dir" ]; then
        time pg_restore -j3 -h db -U postgres -d bak --clean -Fd /deploy/00_pg_dump.dir || true
    elif [ -f "/deploy/00_pg_dump.sql.gz" ]; then
        zcat /deploy/00_pg_dump.sql.gz | time psql -h db -U postgres -d bak
    fi
}

fctInit
fctCreate_bak_db
