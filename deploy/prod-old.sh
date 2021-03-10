set -ex

if [ -z "$1" ]; then
    echo "Usage: prod.sh namespace"
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

if ! kubectl get secrets | grep "\bregcred\b"; then 
    kubectl apply -f ../helm/templates/regcred.yaml
fi

skaffold build -p production 
set -o pipefail
skaffold render -p production \
    --label skaffold.dev/run-id=static --label app.kubernetes.io/managed-by=skaffold |
    tee /tmp/skaffold.render.yaml |
    grep 'image: .*formuladb' |
    while read i; do
        echo "#########################################"
        echo $i
        echo "#########################################"
        img_key=`echo $i | perl -ne 'if (m!.*image: .*/formuladb-([-\w]+):!) {print "$1"}'`
        if [ -n "$img_key" ]; then
            image=`echo $i | perl -pe 's!.*image: !!'`
            echo "$i --> $img_key: $image"
            perl -p -i -e 'my $y=q|'${image}'|; s!image_'${img_key}': registry.*!image_'${img_key}': $y!' ../helm/values.yaml
        fi
    done
set +o pipefail

perl -p -i -e 's/^envtype: .*/envtype: production/' ../helm/values.yaml

export KUBECONFIG=$PWD/../../formuladb-deployment/k8s/production.conf
if ! kubectl get namespace "$NAMESPACE"; then 
    kubectl create namespace "$NAMESPACE" 
fi
helm -n "$NAMESPACE" upgrade --install formuladb ../helm
