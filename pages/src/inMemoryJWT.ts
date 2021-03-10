const inMemoryJWTManager = () => {
    let inMemoryJWT = null;
    let isRefreshing: Promise<boolean> | null = null;
    let logoutEventName = 'ra-logout';
    let refreshEndpoint = '/formuladb-dbrest/rpc/frmdb_refresh_token';
    let refreshTimeOutId;

    let refreshIntervalSec = 60;
    const getRefreshIntervalSec = () => refreshIntervalSec;

    const setLogoutEventName = name => logoutEventName = name;
    const setRefreshTokenEndpoint = endpoint => refreshEndpoint = endpoint;

    // This countdown feature is used to renew the JWT before it's no longer valid
    // in a way that is transparent to the user.
    const refreshToken = (delay) => {
        console.log("refreshToken");
        refreshTimeOutId = window.setTimeout(
            getRefreshedToken,
            delay * 1000 - 5000
        ); // Validity period of the token in seconds, minus 5 seconds
    };

    const abordRefreshToken = () => {
        if (refreshTimeOutId) {
            window.clearTimeout(refreshTimeOutId);
        }
    };

    const waitForTokenRefresh = (): Promise<boolean | null> => {
        if (!isRefreshing) {
            return Promise.resolve(null);
        }
        return isRefreshing.then(() => {
            isRefreshing = null;
            return true;
        });
    }

    // The method make a call to the refresh-token endpoint
    // If there is a valid cookie, the endpoint will set a fresh jwt in memory.
    const getRefreshedToken = () => {
        const token = getToken();
        console.log("refreshToken", token);

        isRefreshing = fetch(refreshEndpoint)
            .then(async (response) => {
                if (response.status !== 200) {
                    console.log("getRefreshedToken", response.status);
                    ereaseToken();
                    global.console.log(
                        'Token renewal failure'
                    );
                    return { token: null };
                }
                let res = await response.json();
                return res[0];
            })
            .then(({ token }) => {
                console.log("getRefreshedToken", token);
                if (token) {
                    setToken(token, refreshIntervalSec);
                    return true;
                }
                ereaseToken();
                return false;
            });

        return isRefreshing;
    };


    const getToken = () => inMemoryJWT;

    const setToken = (token, delay) => {
        inMemoryJWT = token;
        refreshToken(delay);
        return true;
    };

    const ereaseToken = () => {
        inMemoryJWT = null;
        abordRefreshToken();
        window.localStorage.setItem(logoutEventName, '' + Date.now());
        return true;
    }

    // This listener will allow to disconnect a session of ra started in another tab
    window.addEventListener('storage', (event) => {
        if (event.key === logoutEventName) {
            inMemoryJWT = null;
        }
    });

    return {
        ereaseToken,
        getRefreshedToken,
        getToken,
        setLogoutEventName,
        setRefreshTokenEndpoint,
        setToken,
        waitForTokenRefresh,
        getRefreshIntervalSec,
    }
};

export default inMemoryJWTManager();
