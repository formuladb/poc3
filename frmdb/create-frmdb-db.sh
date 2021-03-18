set -ex

sleep 4

mkdir /tmp/migrate-db.lock
trap 'rm -r /tmp/migrate-db.lock' EXIT

until pg_isready -h db -p 5432 -t 1; do echo waiting for database; sleep 2; done;

CMD=$1

fctH1() {
    echo "############################################################################"
    echo "## $1 "
    echo "############################################################################"    
}

fctH2() {
    echo "============================================================================"
    echo "== $1 "
    echo "============================================================================"
}

fctH1 "Creating frmdb db"

psql -h db -U postgres -c 'DROP DATABASE frmdb' || true
psql -v ON_ERROR_STOP=1 -h db -U postgres -c 'CREATE DATABASE frmdb'

for i in /frmdb/*/*.sql; do 
    fctH2 "running $i on frmdb"
    psql -v ON_ERROR_STOP=1 -e -h db -U postgres -d frmdb -f $i
done
fctH2 "frmdb done on frmdb db"

for i in /frmdb/*/*.sql; do 
    fctH2 "running $i on postgres"
    psql -v ON_ERROR_STOP=1 -e -h db -U postgres -d postgres -f $i
done
fctH2 "frmdb done on postgres db"
