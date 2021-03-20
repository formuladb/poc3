set -ex

while true; do find /frmdb | entr -d \
    'migrate_frmdb_db.sh && migrate_test_db.sh && migrate_bak_db.sh && migrate_dev_db.sh && migrate_postgres_db.sh'; 
    sleep 1
done

while true; do find /deploy/00_pg_dump.dir | entr -d \
    'migrate_bak_db.sh && migrate_dev_db.sh && migrate_postgres_db.sh'; 
    sleep 1
done

while true; do find /deploy/apps-resources | entr -d \
    'migrate_test_db.sh && migrate_dev_db.sh && migrate_postgres_db.sh'; 
    sleep 1
done

while true; do find /deploy/apps-pages | entr -d 'migrate_postgres_db_pages.sh'; sleep 1; done
