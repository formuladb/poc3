set -ex
BASEDIR=`dirname "$0"`

if [ -z "$1" -o -z "$2" ]; then
    echo "Usage: localdev.sh namespace workdir"
    exit 1
fi
export NAMESPACE=$1
export WORKDIR=$2

kubectl -n "$NAMESPACE" exec rows-0 -- bash -c "mkdir -p /tenants/default"
$BASEDIR/krsync -auv --exclude=.git "$WORKDIR/*" rows-0@$NAMESPACE:/tenants/default/
kubectl -n "$NAMESPACE" exec rows-0 -- make -f /scripts/migrate.mk
