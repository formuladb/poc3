set -ex
. `dirname $0`/migrate_utils.sh
. `dirname $0`/migrate_resources.sh
. `dirname $0`/migrate_pages.sh

fctInit
fctMigrate_frmdb postgres
fctMigrate_resources postgres
fctMigrate_pages postgres
