set -ex

while true; do find /core /volume/quizzes/ | entr -d bash /bin/migrate_frmdb_db.sh; sleep 1; done
