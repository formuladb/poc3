set -ex

BASEDIR=`dirname "$0"`

if [ -z "$1" -o -z "$2" ]; then
    echo "Usage: localdev.sh namespace workdir"
    exit 1
fi
NAMESPACE=$1
WORKDIR=$2

kubectl -n "$NAMESPACE" logs rows-0 -f &

sleep 1
while true; do 
    find $WORKDIR | entr -d bash $BASEDIR/syncdev.sh "$NAMESPACE" "$WORKDIR"
done
