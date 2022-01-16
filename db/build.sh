set -ex

docker build -t registry.gitlab.com/pagerows/pagerows/db:14 -f Dockerfile .
#docker push registry.gitlab.com/pagerows/pagerows/dbplv8:12.3-2.3.15-1
