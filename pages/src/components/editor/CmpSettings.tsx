import React, { useEffect, useState } from 'react';
import Form from "@rjsf/material-ui";
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { JSONSchema7 } from 'json-schema';
import { useNode, Node as CraftJsNode } from '@craftjs/core';
import { Validator, Schema } from 'jsonschema';
import { FrmdbResourceI, FrmdbResourceWithFields } from '../../core/entity/PrwTable';
import { DataProvider, RecordMap, useDataProvider, useGetList } from 'react-admin';
import { cloneDeep, debounce, isEqual } from 'lodash';
import { useLocation } from 'react-router-dom';
import { parseLocation } from '../../location_utils';
import { ResourceFieldDef } from '../../core/entity/fields';
import { useResources } from '../../useResources';
import { groupByUniqProp } from '../../utils';

export type SyncCmpSettingsCompleter = (node: CraftJsNode, schema: JSONSchema7) => JSONSchema7;
export type AsyncCmpSettingsCompleter = (node: CraftJsNode, schema: JSONSchema7, resource: string, resourceList: RecordMap<FrmdbResourceI> | undefined) => Promise<JSONSchema7>;
const syncCmpSettingsCompleterDefault: SyncCmpSettingsCompleter = ((node: CraftJsNode, schema: JSONSchema7) => schema);
const asyncCmpSettingsCompleterDefault: AsyncCmpSettingsCompleter = ((node: CraftJsNode, schema: JSONSchema7, resource: string, resourceList: RecordMap<FrmdbResourceI> | undefined) => Promise.resolve(schema));
export const CmpSettings = ({
    schema = {} as JSONSchema7,
    uiSchema = undefined as undefined | object,
    syncCmpSettingsCompleter = syncCmpSettingsCompleterDefault,
    asyncCmpSettingsCompleter = asyncCmpSettingsCompleterDefault
}) => {
    const {
        actions: { setProp },
        props,
        node,
    } = useNode((node) => ({
        props: node.data.props,
        node,
    }));

    const resources = useResources();
    const resourcesList: RecordMap<FrmdbResourceI> | undefined = resources.length == 0 ? undefined :
        groupByUniqProp(resources, 'id');

    const jsonSchemaValidator = new Validator();

    const dataProvider = useDataProvider();
    const [dynSchema, setDynSchema] = useState<JSONSchema7>(schema);

    const location = useLocation();
    let pageData = parseLocation(location.pathname);

    useEffect(() => {
        (async () => {
            let resource = props?.resource;
            let resourceCols = [] as ResourceFieldDef[];
            if (resource) {
                let res = await dataProvider.getOne<FrmdbResourceWithFields>(
                    "frmdb_resource_with_fields", { id: resource });
                let refWithFields = res.data;
                resourceCols = refWithFields.field_defs;
            }

            if (resourcesList) {
                let dynSch = cloneDeep(schema);
                await configureDynamicEnums(dynSch, resourcesList, resourceCols);
                if (!isEqual(dynSchema, dynSch)) setDynSchema(dynSch);
            }

        })();
    }, [location, resourcesList, node, schema]);

    console.log(resourcesList, (dynSchema as any)?.properties?.resource?.enum, 'dynSchema=', dynSchema, props, uiSchema);

    const customFields = {
        // AnyOfField: MultiSchemaField as any ,
    };

    const updateComponent = ({ formData }) => {
        setProp((props) => {
            for (let [k, v] of Object.entries(formData)) {
                props[k] = v;
            }
        });
        console.debug("CmpSettings submitted: ", formData, dynSchema);
    };
    const debouncedUpdateComponent = debounce(updateComponent, 350);

    console.log('CmpSettings render', props, dynSchema, uiSchema);
    return (
        <ThemeProvider theme={Theme}>
            <Form uiSchema={uiSchema} schema={dynSchema} formData={props}
                fields={customFields} onChange={debouncedUpdateComponent}
                customFormats={customFormats}
                noValidate={true} />
        </ThemeProvider>
    );
}

const customFormats = {
    'frmdb-category-field-name': /.*/,
    'frmdb-category-resource-name': /.*/,
    'frmdb-multiple-choice': /.*/,
    'frmdb-reference-field-name': /.*/,
    'frmdb-reference-matching-field-name': /.*/,
    'frmdb-reference-resource-name': /.*/,
    'frmdb-resource-field-name': /.*/,
    'frmdb-resource-name': /.*/,
};

const Theme = createMuiTheme({
    spacing: 2,
    typography: {
        fontSize: 12
    },
    palette: {
        primary: {
            main: '#4f3cc9',
        },
        secondary: {
            light: '#5f5fc4',
            main: '#283593',
            dark: '#001064',
            contrastText: '#fff',
        },
        background: {
            default: '#fcfcfe',
        },
        type: 'light' as 'light',
    },
});

async function configureDynamicEnums(
    schema: object,
    resourceList: RecordMap<FrmdbResourceI>,
    resourceCols: ResourceFieldDef[],
) {
    for (let [k, v] of Object.entries(schema)) {
        if (typeof v === "object") {
            if (v?.type === "string"
                && (v?.format === "frmdb-resource-name"
                    || v?.format === "frmdb-category-resource-name"
                )
            ) {
                v.enum = Object.keys(resourceList);
                v.title = 'Table (pages are linked to tables/columns)';
            }
            if (v?.type === "string"
                && (v?.format === "frmdb-resource-field-name"
                    // || v?.format === "frmdb-category-field-name" --- TODO needs to be list of fields from frmdb-category-resource-name
                )
            ) {
                v.enum = resourceCols.map(col => col.name);
                v.title = 'Column (pages are linked to tables/columns)';
            }
            configureDynamicEnums(v, resourceList, resourceCols);
        }
    }
}
function cleanupUndefinedKeys(formData: object) {
    for (let [k, v] of Object.entries(formData)) {
        if (v === undefined || v === null) {
            delete formData[k];
        } else if (typeof v === "object") {
            cleanupUndefinedKeys(v);
        }
    }
}
