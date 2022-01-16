set -ex

# git clone --depth 1 https://github.com/sraoss/pgsql-ivm.git
docker build -t registry.gitlab.com/pagerows/pagerows/dbivm:14 -f Dockerfile .
# docker push registry.gitlab.com/pagerows/pagerows/dbplv8:12.3-2.3.15-1
