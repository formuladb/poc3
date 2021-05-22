set -ex

while true; do find /core /tenants | entr -d bash /scripts/migrate.sh; sleep 1; done
