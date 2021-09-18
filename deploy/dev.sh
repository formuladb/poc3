set -ex

skaffold -n prw dev -p localdev \
    --cleanup=false --port-forward=true \
    --label skaffold.dev/run-id=static \
    #--label app.kubernetes.io/managed-by=skaffold
