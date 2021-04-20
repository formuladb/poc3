export interface AuthToken {
    role: string;
    user_id: string;
    username: string;
    exp: number;
}

export const inMemoryJWTManager = () => {
    let inMemoryJWT: string | null = null;
    let isRefreshing: Promise<boolean> | null = null;
    let logoutEventName = 'ra-logout';
    let refreshEndpoint = '/fdb-resources/rpc/frmdb_refresh_token';
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
                    console.log("getRefreshedToken failed ", response.status);
                    ereaseToken();
                    return {
                        token: btoa(JSON.stringify({
                            role: 'frmdb_anon',
                            user_id: null,
                            username: null,
                        }))
                    };
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
    const getTokenData = () => {
        let ret: Partial<AuthToken> = {};
        if (inMemoryJWT) {
            const base64Data = inMemoryJWT.split('.')[1] || '{}';
            ret = JSON.parse(atob(base64Data)) as Partial<AuthToken>;
        }
        return ret;
    }

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
        getTokenData,
        setLogoutEventName,
        setRefreshTokenEndpoint,
        setToken,
        waitForTokenRefresh,
        getRefreshIntervalSec,
    }
};

export const inMemoryJWT = inMemoryJWTManager();
