set -ex
. `dirname $0`/migrate_utils.sh

fctMigrate_frmdb() {
    fctH2 "Migrating frmdb on ${dbname} "

    dbname=$1
    for i in /frmdb/*/*.sql; do 
        fctH2 "running $i on $dbname"
        psql -v ON_ERROR_STOP=1 -e -h db -U postgres -d "$dbname" -f $i
    done
    fctH2 "SUCCESS migrate frmdb on ${dbname} "
}

fctInit
psql -h db -U postgres -c 'DROP DATABASE frmdb' || true
psql -v ON_ERROR_STOP=1 -h db -U postgres -c 'CREATE DATABASE frmdb'
fctMigrate_frmdb frmdb
