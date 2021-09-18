set -ex 

curl --fail -c mycookie -s -XPOST -H "Content-Type: application/json" \
    'http://dacris.frmdb.localhost/fdb-resources/rpc/frmdb_login' \
    --data-binary '{ "username": "t", "pass": "p" }'

curl --fail -b mycookie -s -XGET \
    'http://dacris.frmdb.localhost/formuladb-resources/presignedUrl/test_table/test_column/upload-image.png'

curl -vv -b mycookie --data-binary @./ci/api-tests/upload-image.png -XPUT \
    -H "Content-Type: image/png" \
    'http://dacris.frmdb.localhost/formuladb-resources/upload/test_table/test_column/upload-image.png'
