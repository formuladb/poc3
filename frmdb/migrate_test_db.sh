set -ex
. `dirname $0`/fct_utils.sh
. `dirname $0`/migrate_resources.sh

fctInit
psql -h db -U postgres -c 'DROP DATABASE test' || true
psql -v ON_ERROR_STOP=1 -h db -U postgres -c 'CREATE DATABASE test WITH TEMPLATE frmdb'
fctMigrate_resources test
