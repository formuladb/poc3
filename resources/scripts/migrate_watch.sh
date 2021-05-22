set -ex

while true; do find /core /volume/resources /volume/pages | entr -d bash /scripts/migrate.sh; sleep 1; done
