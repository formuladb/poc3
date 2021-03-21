set -ex

migrate_frmdb_db.sh || true
migrate_test_db.sh || true
migrate_bak_db.sh || true
migrate_dev_db.sh || true
migrate_postgres_db.sh || true

while true; do echo /deploy/00_pg_dump.sql.gz | entr -d bash -c \
    'migrate_bak_db.sh && migrate_dev_db.sh && migrate_postgres_db.sh'; 
    sleep 1
done &

while true; do find /deploy/apps-resources | entr -d bash -c \
    'migrate_test_db.sh && migrate_dev_db.sh && migrate_postgres_db.sh'; 
    sleep 1
done &

while true; do find /deploy/apps-pages | entr -d migrate_postgres_db_pages.sh; sleep 1; done &

wait
