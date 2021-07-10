set -ex
. `dirname $0`/fct_utils.sh
. `dirname $0`/fctMigrate_frmdb.sh
. `dirname $0`/fctMigrate_resources.sh
. `dirname $0`/fctMigrate_pages.sh

tenant=$1
app=$2

fctInit
fctMigrate_frmdb postgres
fctMigrate_resources postgres "$tenant" "$app"
fctMigrate_pages postgres "$tenant" "$app"
