import { useNode } from '@craftjs/core';
import React from 'react';
import {
    useNotify, Record, useGetOne,
    CRUD_GET_ONE,
} from 'react-admin';
import { CRow } from '../page/CRow';
import { CButton } from '../page/CButton';
import { CText } from '../page/CText';
import { useLocation } from 'react-router-dom';
import { parseLocation } from '../editor/Topbar.utils';
import { CFormProps } from '../../core-domain/page';
import CFormPropsSchema from '../../core-domain/json-schemas/CFormProps.json';
import { CmpSettings } from '../editor/CmpSettings';
import { JSONSchema7 } from 'json-schema';
import { RawForm } from './RawForm';

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

    return <div ref={connect}>
        {resId &&
            <EditForm resource={res} resourceId={resId} children={children} disabled={nP.disabled} enabledActions={nP.enabledActions} />}
        {!resId &&
            <RawForm resource={res} children={children} disabled={nP.disabled} enabledActions={nP.enabledActions} />}
    </div>;
};
CForm.displayName = 'CForm';

export const EditForm = ({
    resource = 'cform_no_resource' as string,
    resourceId = 'cform_no_resource_id' as string,
    children = null as null | React.ReactNode,
    disabled = false as boolean,
    enabledActions = undefined as CFormProps['enabledActions'],
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

    return <RawForm resource={resource} record={record} children={children} disabled={disabled}
        enabledActions={enabledActions} />;
};

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
