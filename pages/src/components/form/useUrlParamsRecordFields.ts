import React, { useMemo } from 'react';
import { Record } from 'react-admin';
import { useLocation } from 'react-router-dom';

export function useUrlParamsRecordFields(): Record {

    const { search } = useLocation();
    const searchParams = useMemo(() => new URLSearchParams(search), [search]);
    const recordFieldsInUrl = useMemo(() => {
        let ret: Record = {} as Record;
        searchParams.forEach((v, k) => {
            ret[k] = v;
        })
        return ret;
    }, [searchParams]);

    return recordFieldsInUrl;
}
