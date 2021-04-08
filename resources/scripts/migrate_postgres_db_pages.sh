set -ex
. `dirname $0`/fct_utils.sh
. `dirname $0`/fctMigrate_pages.sh

fctInit
fctMigrate_pages postgres
