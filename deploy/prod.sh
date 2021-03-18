set -ex

if [ -z "$1" ]; then
    echo "Usage: dev.sh namespace"
    exit 1
fi
NAMESPACE=$1


export KUBECONFIG=k8s/production.conf
if ! kubectl get secrets | grep "\bregcred\b"; then 
    kubectl apply -f ../formuladb/helm/templates/regcred.yaml
fi

skaffold -n "$NAMESPACE" run -p production \
    --label skaffold.dev/run-id=static
