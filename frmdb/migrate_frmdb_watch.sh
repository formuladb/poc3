set -ex

while true; do find /frmdb | entr -d bash /bin/migrate_frmdb_db.sh; sleep 1; done
