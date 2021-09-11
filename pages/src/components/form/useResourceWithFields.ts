import React, { useState, useEffect } from 'react';
import { useAuthenticated } from 'react-admin';
import { useDataProvider } from 'react-admin';
import { ResourceFieldDef } from '../../core/entity/fields';
import { FrmdbResourceWithFields } from '../../core/entity/FrmdbResource';

export function useResourceWithFields(resource: string): FrmdbResourceWithFields {

    const [resourceWithFields, setResourceWithFields] = useState<FrmdbResourceWithFields>({
        id: resource,
        field_defs: [{
            c_table_schema: "public",
            c_table_name: resource,
            name: "id",
            type: "TextField",
            c_is_computed: false,
        }]
    });
    const dataProvider = useDataProvider();

    useEffect(() => {
        let resWithFields: FrmdbResourceWithFields | null = null;
        dataProvider.getOne<FrmdbResourceWithFields>("frmdb_resource_with_fields", { id: resource })
            .then(async (res) => {
                resWithFields = res.data;

                if (resWithFields != null) {

                    for (let field of resWithFields.field_defs) {
                        if (field.c_reference_to) {
                            let referencedResWithFieldDefs = (await dataProvider.getOne<FrmdbResourceWithFields>("frmdb_resource_with_fields",
                                { id: field.c_reference_to }))?.data;
                            
                            resWithFields.refedResWithFields = resWithFields.refedResWithFields || {};
                            resWithFields.refedResWithFields[referencedResWithFieldDefs.id] = referencedResWithFieldDefs;
                        }
                    }
                }
                setResourceWithFields(resWithFields);
            });

    }, [resource]);

    return resourceWithFields;
}


export function useMultipleResourcesWithFields(resources: string[]): FrmdbResourceWithFields[] {

    const [resourcesWithFields, setResourcesWithFields] = useState<FrmdbResourceWithFields[]>([]);
    const dataProvider = useDataProvider();

    useEffect(() => {
        (async () => {
            let ret: FrmdbResourceWithFields[] = [];
            for (let resource of resources) {
                let res = await dataProvider.getOne<FrmdbResourceWithFields>(
                    "frmdb_resource_with_fields", { id: resource });
                ret.push(res.data);
            }
            setResourcesWithFields(ret);
        })();
    }, [resources]);

    //console.debug('response return', resourcesWithFields);
    return resourcesWithFields;
}

