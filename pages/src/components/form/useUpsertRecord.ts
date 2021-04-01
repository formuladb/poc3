import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ResourceFieldDef } from '../../core-domain/fields';
import { Record, useCreate, useDataProvider, useNotify, useRedirect, useTranslate } from 'react-admin';
import { useRouteMatch } from 'react-router-dom';
import { cloneDeep } from 'lodash';
import { useResourceWithFields } from './useResourceWithFields';
import { FrmdbResourceWithFields } from '../../core-domain/records';

export interface UseUpsertRecordRet {
    onUpsertRecord: (data: Partial<Record>) => Promise<void>,
    resourceWithFields: FrmdbResourceWithFields,
}
export function useUpsertRecord(resource: string): UseUpsertRecordRet {

    const resourceWithFields = useResourceWithFields(resource);
    const resourceCols = resourceWithFields ? resourceWithFields.field_defs : [];
    const dataProvider = useDataProvider();
    const notify = useNotify();

    let { url } = useRouteMatch();
    const redirect = useRedirect();
    const translate = useTranslate();

    const dataProviderOpts = useMemo(() => ({
        onSuccess: ({ data }) => {
            notify(`${translate('saved')} ${translate(`resources.${resource}.name`)} #${data['id']}`, 'info');
            if (url.match(/\/create$/)) {
                redirect(url.replace(/\/create$/, `/${data['id']}`));
            }
        },
        onFailure: (error) => {
            notify(error.message || JSON.stringify(error), 'error');
        }
    }), [resource, url, redirect, translate]);

    const onUpsertRecord = useCallback(async (rec: Partial<Record>) => {
        let data = cloneDeep(rec);
        console.log('COLS', resourceCols);
        if (resource.indexOf('frmdbvw') < 0) {
            for (let col of resourceCols) {
                // id col is needed for Upsert functionality on the server, we must not delete it
                let keepIdCol = col.name === "id" && undefined != data['id'];
                if ((col.c_is_computed == true || col.c_formula) && !keepIdCol) {
                    delete data[col.name];
                }
            }
        }

        if (undefined != data['id']) {
            dataProvider.update(resource, {
                id: data['id'], 
                data,
                previousData: {id: "not-using-previous-data"},
            }, dataProviderOpts)
        } else {
            dataProvider.create(resource, { data }, dataProviderOpts);
        }
    }, [resource, resourceWithFields, resourceCols, dataProvider, dataProviderOpts]);

    return { onUpsertRecord, resourceWithFields };
}
