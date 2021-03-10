set -ex

trap _cleanup ERR
trap _cleanup EXIT
URLBASE=${1}
if [ -z "$URLBASE" ]; then
    URLBASE=http://frmdb.localhost
fi
export URLBASE

echo '<testsuites><testsuite name="API tests">' > api-tests.junit.xml
function _cleanup {
    echo '</testsuite></testsuites>' >> api-tests.junit.xml
}

tmpLog=/tmp/api-tests.$$.log
for i in ci/api-tests/[a-z]*; do
    echo -n '<testcase classname="API" name="'$i'" ' >> api-tests.junit.xml
    set -o pipefail
    if bash $i "$HOST" 2>&1 | tee $tmpLog; then 
        echo ' />' >> api-tests.junit.xml
    else
        echo '><failure message="err">'`cat $tmpLog`'</failure></testcase>' >> api-tests.junit.xml
    fi
done
