echo "##########################################"
echo "## $0"
echo "##########################################"
set -ex 

fctCurl() {
    { set +x; } 2>/dev/null
    STATUSCODE=$(curl -v -o /tmp/$$ -w "%{http_code}" "$@")
    cat /tmp/$$
    echo
    if [ $STATUSCODE -ne 200 ]; then echo "ERROR $STATUSCODE"; exit 1; fi
    set -x
}

_l() { 
    { set +x; } 2>/dev/null
    : 
    set -x
}

_l "# anonymous ==================================="
fctCurl 'http://localhost/rows-db/rpc/frmdb_refresh_token'

# # curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoicG9zdGdyZXMiLCJ1c2VybmFtZSI6InQiLCJleHAiOjE2MDU0NjA0NjN9.A7uvopz9p86mmQLuXhUsHD_5FlwIvlioydQ3zfQL-Oo" 'http://localhost/rows-db/technicians'

_l "# login ==================================="
fctCurl -c mycookie -XPOST -H "Content-Type: application/json" \
    'http://localhost/rows-db/rpc/frmdb_login' \
    --data-binary '{ "username": "prw", "pass": "prw" }'

_l "# basic API access dbrest ===================================#"
fctCurl -b mycookie -H "accept-profile: prw" 'http://localhost/dbrest/prw_tenants'
_l "# basic API access ===================================#"
fctCurl -b mycookie 'http://localhost/rows-db/prw_tenants'

# _l "# refresh token ===================================#"
# curl --fail -vvL -c mycookie -b 1 \
#     'http://localhost/rows-db/rpc/frmdb_refresh_token'

# _l "# API access ===================================#"
# curl --fail -vvL -b mycookie \
#     'http://localhost/rows-db/technicians'


# _l "# logout ===================================#"
# curl --fail -vvL -c mycookie -b mycookie \
#     'http://localhost/rows-db/rpc/frmdb_logout'

# _l "# API access ===================================#"
# curl --fail -vvL -b mycookie \
#     'http://localhost/rows-db/technicians'
