set -ex
. `dirname $0`/fct_utils.sh
. `dirname $0`/migrate_pages.sh

fctInit
fctMigrate_pages postgres
