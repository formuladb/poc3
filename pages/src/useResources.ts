import React, { useState, useEffect } from 'react';
import { FrmdbResourceI } from './core/entity/PrwTable';
import { useDataProvider } from 'react-admin';

export function useResources(): FrmdbResourceI[] {

    const [resources, setResources] = useState<FrmdbResourceI[]>([]);
    const dataProvider = useDataProvider();

    useEffect(() => {
        dataProvider.getList("prw_tables", {
            pagination: { page: 1, perPage: 100 },
            sort: { field: 'id', order: 'ASC' },
            filter: {}
        })
            .then(res => {
                if (!res) return [{ name: "actors" }];
                setResources(res.data as any as FrmdbResourceI[]);
            });
    }, []);

    return resources;
}
