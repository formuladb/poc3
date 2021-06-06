set -ex
. `dirname $0`/fct_utils.sh
. `dirname $0`/fctMigrate_frmdb.sh
. `dirname $0`/fctMigrate_resources.sh
. `dirname $0`/fctMigrate_pages.sh

fctInit
fctMigrate_frmdb postgres
fctMigrate_resources postgres
fctMigrate_pages postgres
