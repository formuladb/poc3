set -ex

while true; do find /frmdb /deploy | entr -d bash /bin/migrate.sh; sleep 1; done
