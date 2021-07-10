import React, { useState, useEffect } from 'react';
import { FrmdbResource } from './core-domain/core-resources/FrmdbResource';
import { useDataProvider } from 'react-admin';

export function useResources(): FrmdbResource[] {

    const [resources, setResources] = useState<FrmdbResource[]>([]);
    const dataProvider = useDataProvider();

    useEffect(() => {
        dataProvider.getList("frmdb_resources", {
            pagination: { page: 1, perPage: 100 },
            sort: { field: 'id', order: 'ASC' },
            filter: {}
        })
            .then(res => {
                if (!res) return [{ name: "actors" }];
                setResources(res.data as any as FrmdbResource[]);
            });
    }, []);

    return resources;
}
