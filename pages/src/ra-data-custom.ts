import { fetchUtils, DataProvider, Identifier, GetOneParams } from 'ra-core';
import {
    UpdateResult, Record, UpdateParams,
    CreateParams, cacheDataProviderProxy
} from 'react-admin';
import postgrestRestProvider from './ra-data-postgrest';
import httpClient from './http-client';
import { frmdb_sp_table_columns } from './custom-api/frmdb_sp_table_columns';
import { FrmdbResourceWithFields } from './core-domain/records';
import { avoidDuplicatesDataProviderProxy } from './ra-data-avoid-duplicates-proxy';

const postgrestUrl = '/formuladb-dbrest';
const postgrestProvider = postgrestRestProvider(postgrestUrl, httpClient);
const baseProvider = postgrestProvider; 
let customProvidersFactory = (window as any).$FRMDB_UI_PAGES?.CUSTOM_PROVIDERS || function (defaultDataProvider: DataProvider) {
    return {};
}
const customProviders: { [x: string]: DataProvider } = customProvidersFactory(baseProvider);

const customDataProvider = {
    ...baseProvider,
    getOne: async (resource: string, params: GetOneParams) => {
        if (resource === "frmdb_resource_with_fields") {
            let cols = await frmdb_sp_table_columns(params.id + '');
            let resWithFields: FrmdbResourceWithFields = {
                id: params.id + '',
                field_defs: cols,
            }
            return { data: resWithFields };
        } else if (customProviders[resource]) return customProviders[resource].getOne(resource, params);
        else return baseProvider.getOne(resource, params);
    },
    update: async (resource: string, params: UpdateParams) => {
        let files: { rawFile: File, resource: string, columNname: string }[] = [];
        for (let [k, v] of Object.entries<any>(params.data)) {
            if (v?.rawFile instanceof File) {
                files.push({
                    ...v,
                    resource,
                    columNname: k,
                });
            }
        }
        if (files.length > 0) {
            await Promise.all(files.map(f => uploadFileToObjstore(f)));
        }
        for (let f of files) {
            params.data[f.columNname] = `/frmdb-bucket/${f.resource}/${f.columNname}/${f.rawFile.name}`;
        }

        if (customProviders[resource]) return customProviders[resource].update(resource, params);
        else return postgrestProvider.update(resource, params);
    },
    create: (resource: string, params: CreateParams) => {
        if (customProviders[resource]) return customProviders[resource].create(resource, params);
        else return postgrestProvider.create(resource, params);
    }
} as DataProvider;

export default cacheDataProviderProxy(
    avoidDuplicatesDataProviderProxy(customDataProvider, 10000),
    10000
);

async function uploadFileToObjstore(file: { rawFile: File, resource: string, columNname: string }) {
    let url: string = `/formuladb-objstore/upload/${file.resource}/${file.columNname}/${file.rawFile.name}`;
    await fetch(url, {
        method: 'PUT',
        body: file.rawFile
    });
}
