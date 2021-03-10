set -ex

if [ -z "$1" ]; then
    echo "Usage: dev.sh namespace"
    exit 1
fi
NAMESPACE=$1


skaffold -n "$NAMESPACE" run -p production \
    --label skaffold.dev/run-id=static --label app.kubernetes.io/managed-by=skaffold
