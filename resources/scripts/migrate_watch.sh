set -ex

while true; do find /sql /volume/resources /volume/pages | entr -d bash /scripts/migrate.sh; sleep 1; done
