import { AuthProvider } from 'ra-core';
import inMemoryJWT from './inMemoryJWT';

const authProvider: AuthProvider = {
    init: () => {
        inMemoryJWT.getRefreshedToken();
    },
    login: ({ username, password }) => {
        const request = new Request('/formuladb-dbrest/rpc/frmdb_login', {
            method: 'POST',
            body: JSON.stringify({ username, pass: password }),
            headers: new Headers({ 'Content-Type': 'application/json' }),
            credentials: 'include',
        });
        inMemoryJWT.setRefreshTokenEndpoint('/formuladb-dbrest/rpc/frmdb_refresh_token');
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
        const request = new Request('/formuladb-dbrest/rpc/logout', {
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
         /*|| status === 403, 403 means no permissions, it should not force the user to login again*/
        if (status === 401) {
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
};

export default authProvider; 
