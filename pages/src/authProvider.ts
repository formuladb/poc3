import { AuthProvider } from 'ra-core';
import { UserIdentity } from 'react-admin';
import { inMemoryJWT } from './inMemoryJWT';

const authProvider: AuthProvider = {
    init: () => {
        inMemoryJWT.getRefreshedToken();
    },
    login: ({ username, password }) => {
        const request = new Request('/rows-db/rpc/frmdb_login', {
            method: 'POST',
            body: JSON.stringify({ username, pass: password }),
            headers: new Headers({ 'Content-Type': 'application/json' }),
            credentials: 'include',
        });
        inMemoryJWT.setRefreshTokenEndpoint('/rows-db/rpc/frmdb_refresh_token');
        return fetch(request)
            .then(async (response) => {
                if (response.status < 200 || response.status >= 300) {
                    throw new Error(response.statusText);
                }
                let res = await response.json();
                // e.g. [{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoicG9zdGdyZXMiLCJ1c2VybmFtZSI6InQiLCJleHAiOjE2MDU0MzQ3MTB9.lfrtTTYm4_0paen-zMJ8tdQX_7QAxGrRb1W8-xanBsc"}]
                return res[0];
            })
            .then(({ token }) => {
                return inMemoryJWT.setToken(token, inMemoryJWT.getRefreshIntervalSec());
            });
    },

    logout: () => {
        const request = new Request('/rows-db/rpc/frmdb_logout', {
            method: 'GET',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            credentials: 'include',
        });
        inMemoryJWT.ereaseToken();

        return fetch(request).then(() => '/login');
    },

    checkAuth: () => {
        return inMemoryJWT.waitForTokenRefresh().then(() => {
            return inMemoryJWT.getToken() ? Promise.resolve() : Promise.reject();
        });
    },

    checkError: (error) => {
        const status = error.status;
        if (status === 401
            || (status === 403 
                //403 means no permissions, it should not force the user to login again, unless it has no permission on the resources table
                && error.message.indexOf('permission denied for table prw_tables') >= 0)
        ) {
            inMemoryJWT.ereaseToken();
            return Promise.reject();
        }
        return Promise.resolve();
    },

    getPermissions: () => {
        return inMemoryJWT.waitForTokenRefresh().then(() => {
            return inMemoryJWT.getToken() ? Promise.resolve() : Promise.reject();
        });
    },

    getIdentity: () => {
        const tokenData = inMemoryJWT.getTokenData();
        return Promise.resolve({
            id: tokenData?.user_id && tokenData?.user_id != "null" ? parseInt(tokenData.user_id) : undefined,
            fullName: tokenData?.username && tokenData?.username != "null" ? tokenData?.username : 'Anonymous',
            role: tokenData?.role,
        } as UserIdentity);
    }
};

export default authProvider; 
