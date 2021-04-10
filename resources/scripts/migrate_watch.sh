set -ex

while true; do find /sql /volume/quizzes/resources /volume/quizzes/pages | entr -d bash /bin/migrate.sh; sleep 1; done
