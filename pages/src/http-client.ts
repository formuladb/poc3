import { fetchUtils } from 'react-admin';
import inMemoryJWT from './inMemoryJWT';

export default (url, options) => {
    const token = inMemoryJWT.getToken();
    if (!options) options = {};
    if (!options?.headers) options.headers = new Headers();

    if (token) {
        // options.headers.set('Authorization', `Bearer ${token}`);
        return fetchUtils.fetchJson(url, options);
    } else {
        inMemoryJWT.setRefreshTokenEndpoint('/fdb-resources/rpc/frmdb_refresh_token');
        return inMemoryJWT.getRefreshedToken().then((gotFreshToken) => {
            if (gotFreshToken) {
                options.headers.set('Authorization', `Bearer ${inMemoryJWT.getToken()}`);
            };
            return fetchUtils.fetchJson(url, options);
        });
    }
};