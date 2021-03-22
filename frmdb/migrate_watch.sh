set -ex

while true; do find /frmdb /deploy | entr -d migrate.sh; sleep 1; done
