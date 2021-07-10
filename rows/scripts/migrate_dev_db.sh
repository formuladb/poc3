set -ex
. `dirname $0`/fct_utils.sh
. `dirname $0`/fctMigrate_resources.sh

tenant=$1
app=$2

fctInit
psql -h db -U postgres -c 'DROP DATABASE dev' || true
psql -v ON_ERROR_STOP=1 -h db -U postgres -c 'CREATE DATABASE dev WITH TEMPLATE bak'
fctMigrate_resources dev "$tenant" "$app"
