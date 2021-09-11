import React, { useState, useEffect } from 'react';
import { groupByUniqProp } from './utils';
import { FrmdbSystemParamI } from './core/entity/FrmdbSystemParam';
import { DataProvider, useDataProvider } from 'react-admin';
import { Dictionary } from 'lodash';

export function useSystemParams(dataProvider: DataProvider): Dictionary<FrmdbSystemParamI> {

    const [systemParams, setSystemParams] = useState<Dictionary<FrmdbSystemParamI>>({});

    useEffect(() => {
        dataProvider.getList("frmdb_system_params", {
            pagination: { page: 1, perPage: 100 },
            sort: { field: 'id', order: 'ASC' },
            filter: {}
        })
            .then(res => {
                if (!res) return [{ name: "actors" }];
                setSystemParams(
                    groupByUniqProp(res.data as any as FrmdbSystemParamI[], 'id')
                );
            });
    }, []);


    return systemParams;
}
