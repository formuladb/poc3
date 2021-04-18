import { fetchUtils, DataProvider, Identifier, GetOneParams } from 'ra-core';
import {
    UpdateResult, Record, UpdateParams,
    CreateParams,
    GetListParams,
    GetManyParams,
    GetListResult,
    GetManyResult,
    GetOneResult,
} from 'react-admin';

class InMemCache<K, T> {
    cache = new Map<string, { validUntil: Date, value: T }>();

    constructor(private validityMs) { }

    get(k: K): T | undefined {
        let entry = this.cache.get(JSON.stringify(k));
        if (entry) {
            if (entry.validUntil.getTime() > new Date().getTime()) {
                return entry.value;
            }
        }
    }

    set(k: K, value: T) {
        const validUntil = new Date();
        validUntil.setTime(validUntil.getTime() + this.validityMs);
        let entry = { validUntil, value };
        this.cache.set(JSON.stringify(k), entry);
    }
}

export function avoidDuplicatesDataProviderProxy(baseDataProvider: DataProvider, periodMs: number): DataProvider {

    function wrapper(
        method: DataProvider['getList'] | DataProvider['getOne'] | DataProvider['getMany']
    ): any {
        const cache = new InMemCache<{ resource: string, params: any }, any>(periodMs);

        return (resource: string, params: Parameters<typeof method>[1]) => {
            const key = { resource, params };
            let cacheEntry = cache.get(key);
            //console.debug(resource, params, cacheEntry);
            if (!cacheEntry) {
                const ret = (method as any).call(null, resource, params);
                cache.set(key, ret);
            }
            const toRet = cache.get(key) as ReturnType<typeof method>;;
            return toRet;
        };
    }

    return {
        ...baseDataProvider,
        getList: wrapper(baseDataProvider.getList),
        getOne: wrapper(baseDataProvider.getOne),
        getMany: wrapper(baseDataProvider.getMany),
    }
}
