set -ex

fctMigrTime() {
    find "$@" -type f -printf '%T@ %p\n' | sort -n | tail -1 |cut -d'.' -f1
}
fctLogTime() {
    stat -c %Y "$1" || echo 0
}

frmdbMigrTime=`fctMigrTime /frmdb`
bakMigrTime=`fctMigrTime /deploy/00_pg_dump.sql.gz`
resourcesMigrTime=`fctMigrTime /deploy/apps-resources`
pagesMigrTime=`fctMigrTime /deploy/apps-pages`

migrate_frmdb_db_Time=`fctLogTime migrate_frmdb_db.time`
migrate_test_db_Time=`fctLogTime migrate_test_db.time`
migrate_bak_db_Time=`fctLogTime migrate_bak_db.time`
migrate_dev_db_Time=`fctLogTime migrate_dev_db.time`
migrate_postgres_db_Time=`fctLogTime migrate_postgres_db.time`

echo "## migrate.sh #################################################################"

if [ $frmdbMigrTime -gt $migrate_frmdb_db_Time ]; then 
    migrate_frmdb_db.sh && touch migrate_frmdb_db.time
fi
if [ $frmdbMigrTime -gt $migrate_test_db_Time ]; then 
    migrate_test_db.sh
    [ $? -eq 0 ] && touch migrate_test_db.time
fi
if [ $frmdbMigrTime -gt $migrate_bak_db_Time -o $bakMigrTime -gt $migrate_bak_db_Time ]; then 
    migrate_bak_db.sh
    [ $? -eq 0 ] && touch migrate_bak_db.time
fi
if [ $frmdbMigrTime -gt $migrate_dev_db_Time -o $bakMigrTime -gt $migrate_dev_db_Time -o $resourcesMigrTime -gt $migrate_dev_db_Time ]; then 
    migrate_dev_db.sh
    [ $? -eq 0 ] && touch migrate_dev_db.time
fi
if [ $frmdbMigrTime -gt $migrate_postgres_db_Time -o $bakMigrTime -gt $migrate_postgres_db_Time -o $resourcesMigrTime -gt $migrate_postgres_db_Time -o $pagesMigrTime -gt $migrate_postgres_db_Time ]; then 
    migrate_postgres_db.sh
    [ $? -eq 0 ] && touch migrate_postgres_db.time
fi
