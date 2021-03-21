set -ex 

echo "#####################################################"
echo "# login"
curl --fail -vv -c mycookie -s -XPOST -H "Content-Type: application/json" \
    'http://dacris.frmdb.localhost/fdb-resources/rpc/frmdb_login' \
    --data-binary '{ "username": "t", "pass": "p" }'

# curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoicG9zdGdyZXMiLCJ1c2VybmFtZSI6InQiLCJleHAiOjE2MDU0NjA0NjN9.A7uvopz9p86mmQLuXhUsHD_5FlwIvlioydQ3zfQL-Oo" 'http://dacris.frmdb.localhost/fdb-resources/technicians'

echo "#####################################################"
echo "# API access"
curl --fail -vvL -b mycookie \
    'http://dacris.frmdb.localhost/fdb-resources/technicians'

echo "#####################################################"
echo "# refresh token"
curl --fail -vvL -c mycookie -b mycookie \
    'http://dacris.frmdb.localhost/fdb-resources/rpc/frmdb_refresh_token'

echo "#####################################################"
echo "# API access"
curl --fail -vvL -b mycookie \
    'http://dacris.frmdb.localhost/fdb-resources/technicians'


echo "#####################################################"
echo "# logout"
curl --fail -vvL -c mycookie -b mycookie \
    'http://dacris.frmdb.localhost/fdb-resources/rpc/frmdb_logout'

echo "#####################################################"
echo "# API access"
curl --fail -vvL -b mycookie \
    'http://dacris.frmdb.localhost/fdb-resources/technicians'
