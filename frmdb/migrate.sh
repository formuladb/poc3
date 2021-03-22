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

migrate_frmdb_db_Time=`fctLogTime migrate_frmdb_db.log`
migrate_test_db_Time=`fctLogTime migrate_test_db.log`
migrate_bak_db_Time=`fctLogTime migrate_bak_db.log`
migrate_dev_db_Time=`fctLogTime migrate_dev_db.log`
migrate_postgres_db_Time=`fctLogTime migrate_postgres_db.log`


if [ frmdbMigrTime -gt migrate_frmdb_db_Time ]; then 
    migrate_frmdb_db.sh | tee migrate_frmdb_db.log
fi
if [ frmdbMigrTime -gt migrate_test_db_Time ]; then 
    migrate_test_db.sh | tee migrate_test_db.log
fi
if [ frmdbMigrTime -gt migrate_bak_db_Time -o bakMigrTime -gt migrate_bak_db_Time ]; then 
    migrate_bak_db.sh | tee migrate_bak_db.log
fi
if [ frmdbMigrTime -gt migrate_dev_db_Time -o bakMigrTime -gt migrate_dev_db_Time -o resourcesMigrTime -gt migrate_dev_db_Time ]; then 
    migrate_dev_db.sh | tee migrate_dev_db.log
fi
if [ frmdbMigrTime -gt migrate_postgres_db_Time -o bakMigrTime -gt migrate_postgres_db_Time -o resourcesMigrTime -gt migrate_postgres_db_Time -o pagesMigrTime -gt migrate_postgres_db_Time ]; then 
    migrate_postgres_db.sh | tee migrate_postgres_db.log
fi
