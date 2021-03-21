fctInit() {
    if ! mkdir /tmp/upgrade.lock; then echo "another migration in progress"; exit 1; fi
    trap 'rm -r /tmp/upgrade.lock' EXIT
    until pg_isready -h db -p 5432 -t 1; do echo waiting for database; sleep 2; done;
}

fctH1() {
    echo "############################################################################"
    echo "#### $1 ####"
}

fctH2() {
    echo "==== $1 ===="
}
