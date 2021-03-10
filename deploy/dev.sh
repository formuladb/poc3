set -ex

if [ -z "$1" ]; then
    echo "Usage: dev.sh namespace"
    exit 1
fi
NAMESPACE=$1

# # npx concurrently -k --names "compile,bundle,skaffold" \
# #     "npx tsc -b -w --preserveWatchOutput" \
# #     "npx lerna run watch:bundle --parallel --stream  2>&1 | egrep -i 'compiled successfully in|error'" \
# #     "skaffold dev -i 800 -n \"$1\" -p localdev --tail=false --cleanup=false --port-forward=false --label skaffold.dev/run-id=static --label app.kubernetes.io/managed-by=skaffold" \

# (
#     cd ../deploy-server
#     npm run watch-local
# ) &

skaffold -n "$NAMESPACE" dev -p localdev \
    --cleanup=false --port-forward=false \
    --label skaffold.dev/run-id=static \
    #--label app.kubernetes.io/managed-by=skaffold
