import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ResourceFieldDef } from '../../core/entity/fields';
import {
    Record, useCreate, useDataProvider,
    useNotify, useRedirect, useTranslate,
    RedirectionSideEffect,
} from 'react-admin';
import { useRouteMatch } from 'react-router-dom';
import { cloneDeep } from 'lodash';
import { useResourceWithFields } from './useResourceWithFields';
import { FrmdbResourceWithFields } from '../../core/entity/PrwTable';

export interface UseUpsertRecordRet {
    onUpsertRecord: (data: Partial<Record>, redirectTo?: string, beforeSave?: (resource, data) => void) => Promise<void>,
    resourceWithFields: FrmdbResourceWithFields,
}
export function useUpsertRecord(resource: string): UseUpsertRecordRet {

    const resourceWithFields = useResourceWithFields(resource);
    const dataProvider = useDataProvider();
    const notify = useNotify();

    let { url } = useRouteMatch();
    const redirect = useRedirect();
    const translate = useTranslate();

    const dataProviderOpts = useMemo(() => ({
        onSuccess: ({ data }) => {
            notify(`${translate('saved')} ${translate(`resources.${resource}.name`)} #${data['id']}`, 'info');
        },
        onFailure: (error) => {
            notify(error.message || JSON.stringify(error), 'error');
        }
    }), [resource, url, redirect, translate]);

    const onUpsertRecord = useCallback(async (rec: Partial<Record>, redirectTo?: string, beforeSave?: (resource, data) => void) => {
        let data = cloneDeep(rec);
        if (resource.indexOf('frmdbvw') < 0) {
            for (let col of (resourceWithFields.field_defs || [])) {
                // id col is needed for Upsert functionality on the server, we must not delete it
                let keepIdCol = col.name === "id" && undefined != data['id'];
                if ((col.c_is_computed == true || col.c_formula) && !keepIdCol) {
                    delete data[col.name];
                }
            }
        }

        if (beforeSave) {
            beforeSave(resource, data);
        }

        // if (undefined != data['id']) {
        //     await dataProvider.update(resource, {
        //         id: data['id'],
        //         data,
        //         previousData: { id: "not-using-previous-data" },
        //     }, dataProviderOpts)
        // } else {
            await dataProvider.create(resource, { data }, dataProviderOpts);
        // }

        if (url.match(/\/create$/)) {
            redirect(url.replace(/\/create$/, `/${data['id']}`));
        } else if (redirectTo != undefined) {
            redirect(redirectTo, resourceWithFields.id);
        }

    }, [resource, resourceWithFields, dataProvider, dataProviderOpts]);

    return { onUpsertRecord, resourceWithFields };
}
