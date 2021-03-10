import { Element, useNode } from '@craftjs/core';
import React, { Children, useState } from 'react';
import { ContainerDefaultProps, ContainerSettings } from '../page/CPaper';
import { DeleteButton, FormWithRedirect, SaveButton, useCreate, useNotify, Record, useGetOne, CRUD_GET_ONE, useRedirect } from 'react-admin';
import { Toolbar, Box, Grid, AppBar, Tabs, Tab } from '@material-ui/core';
import { CRow } from '../page/CRow';
import { CButton } from '../page/CButton';
import { CText } from '../page/CText';
import { useLocation } from 'react-router-dom';
import { parseLocation } from '../editor/Topbar.utils';
import { useUpsertRecord } from './useUpsertRecord';
import { FormWithRedirectProps } from 'react-admin';
import { CFormProps } from '../../core-domain/page';
import CFormPropsSchema from '../../core-domain/json-schemas/CFormProps.json';
import { CmpSettings } from '../editor/CmpSettings';
import { JSONSchema7 } from 'json-schema';
import { RawFormContext, RawFormContextData } from './useRawFormContext';
import { groupByUniqProp } from '../utils';
import { useValidators } from './useValidators';

export function CForm({
    children = null as null | React.ReactNode,
    ...nP
}: CFormProps & { children: null | React.ReactNode }) {
    const {
        connectors: { connect },
    } = useNode();

    const location = useLocation();
    let pageData = parseLocation(location.pathname);
    const res = nP.resource || pageData.parsedPath[0]?.resourceName || 'cform_no_resource';
    let resId = nP.resourceId || pageData.parsedPath[0]?.resourceId;
    resId = resId != "create" ? resId : undefined;

    console.log('FFFFF', resId);
    return <div ref={connect}>
        {resId &&
            <EditForm resource={res} resourceId={resId} children={children} disabled={nP.disabled} />}
        {!resId &&
            <RawForm resource={res} children={children} disabled={nP.disabled} />}
    </div>;
};
CForm.displayName = 'CForm';

export const EditForm = ({
    resource = 'cform_no_resource' as string,
    resourceId = 'cform_no_resource_id' as string,
    children = null as null | React.ReactNode,
    disabled = false as boolean,
}) => {
    const notify = useNotify();
    const { data: record, loading, loaded } = useGetOne<Record>(
        resource,
        resourceId,
        {
            action: CRUD_GET_ONE,
            onFailure: () => {
                notify('ra.notification.item_doesnt_exist', 'warning');
                // redirect('list', basePath);
                // refresh();
            },
        }
    );

    return <RawForm resource={resource} record={record} children={children} disabled={disabled} />;
};

export type RawFormProps = Parameters<typeof RawForm>[0];
export const RawForm = ({
    resource = 'cform_no_resource' as string,
    record = undefined as Record | undefined,
    children = null as null | React.ReactNode,
    disabled = false as boolean,
    refToParentListFieldName = undefined as string | undefined,
    parentResourceId = undefined as string | undefined,
    onSave = undefined as undefined | ((data: Partial<Record>, saveOk: boolean) => void | Promise<void>)
}) => {

    const { resourceCols, onUpsertRecord } = useUpsertRecord(resource);
    const save: FormWithRedirectProps['save'] = (data, redirectTo, optional) => {
        if (refToParentListFieldName && parentResourceId) {
            data[refToParentListFieldName] = parentResourceId;
        }
        onUpsertRecord(data);
        if (onSave) onSave(data, true);
    }
    const fieldDefsByName = groupByUniqProp(resourceCols, 'name');
    const validators = useValidators(resource, fieldDefsByName, record == undefined);
    const validateForm = (values) => {
        const errors = {};
        for (let [k, v] of Object.entries(values)) {
            if (validators[k]) {
                const err = validators[k](v, values, null);
                if (err) errors[k] = err;
            }
        }
        return errors;
    };

    const [inputs, setInputs] = useState<RawFormContextData['inputs']>({});
    const addInput: RawFormContextData['addInput'] = (name, props) => {
        if (!inputs[name]) {
            setInputs({
                ...inputs,
                [name]: props,
            });
        }
    }
    const formContext: RawFormContextData = { 
        isCreate: record == undefined,
        resource, 
        fieldDefsByName, 
        inputs, 
        addInput 
    };

    return (
        <RawFormContext.Provider value={formContext}>
            <FormWithRedirect
                save={save}
                record={record}
                validate={validateForm}
                render={formProps => (
                    // here starts the custom form layout
                    <form style={{ width: '100%' }}>
                        <fieldset disabled={disabled} style={{ border: 0 }}>
                            <Box width="100%" p={2} >
                                <Grid container direction="column" spacing={2} wrap="wrap" justify="space-between"
                                    style={{ padding: '10px' }}
                                >
                                    {/* {Children.count(children)} */}
                                    {children}
                                </Grid>
                            </Box>
                            <Toolbar>
                                <Box display="flex" justifyContent="space-between" width="100%" borderTop={1} pt={2} borderColor="grey.500" >
                                    <SaveButton
                                        saving={formProps.saving}
                                        handleSubmitWithRedirect={formProps.handleSubmitWithRedirect}
                                    />
                                    <DeleteButton
                                        resource={resource}
                                        record={formProps.record}
                                        saving={formProps.saving}
                                        redirect={undefined}
                                    />
                                </Box>
                            </Toolbar>
                        </fieldset>
                    </form>
                )}
            />
        </RawFormContext.Provider>
    );
};
RawForm.displayName = 'RawForm';

const CFormSettingSchema = CFormPropsSchema as JSONSchema7;
console.log('CFormSettingSchema=', CFormSettingSchema);
export const CFormSettings = () => {
    return <CmpSettings schema={CFormSettingSchema} />
};

CForm.craft = {
    displayName: 'Form',
    props: { resource: "frmdb_pages" } as CFormProps,
    related: {
        settings: CFormSettings,
    },
    rules: {
        canMoveIn: (incomingNode) => {
            console.log('CForm.canMoveIn', incomingNode.data.type, incomingNode);
            return [CRow, CForm, CButton, CText].includes(incomingNode.data.type);
        }
    },
};
