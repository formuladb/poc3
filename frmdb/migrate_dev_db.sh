set -ex
. `dirname $0`/fct_utils.sh
. `dirname $0`/migrate_resources.sh

fctInit
psql -h db -U postgres -c 'DROP DATABASE dev' || true
psql -v ON_ERROR_STOP=1 -h db -U postgres -c 'CREATE DATABASE dev WITH TEMPLATE bak'
fctMigrate_resources dev
