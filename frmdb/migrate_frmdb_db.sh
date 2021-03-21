set -ex
. `dirname $0`/fct_utils.sh
. `dirname $0`/fctMigrate_frmdb.sh

fctInit
psql -h db -U postgres -c 'DROP DATABASE frmdb' || true
psql -v ON_ERROR_STOP=1 -h db -U postgres -c 'CREATE DATABASE frmdb'
fctMigrate_frmdb frmdb
