set -ex 

curl --fail -vv -c mycookie -s -XPOST -H "Content-Type: application/json" \
    'http://dacris.frmdb.localhost/fdb-resources/rpc/frmdb_login' \
    --data-binary '{ "username": "t", "pass": "p" }'
curl --fail -vvL -b mycookie -XPOST \
    'http://dacris.frmdb.localhost/fdb-resources/prw_pages' -d '{"bla": 1}'
