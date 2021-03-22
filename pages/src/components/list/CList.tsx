import { Node as CraftJsNode, useNode } from '@craftjs/core';
import React, { useEffect, useState } from 'react';
import {
    RecordMap, useListContext, Record,
    useCreate, useNotify,
    DatagridProps,
    useGetOne,
    CRUD_GET_ONE,
    ReferenceManyField,
    useTranslate,
} from 'react-admin';
import { DEFAULT_COLS, FieldType, FieldTypes, ResourceFieldDef } from '../../core-domain/fields';
import { ListDatagrid } from './ListDatagrid';
import { ListTable } from './ListTable';
import { ListTabs } from './ListTabs';
import { ListFormList } from './ListFormList';
import { CmpSettings } from '../editor/CmpSettings';
import { JSONSchema7 } from 'json-schema';
import { CmpCraftStatic } from '../utils';
import { useLocation } from 'react-router-dom';
import { parseLocation } from '../editor/Topbar.utils';
import { Grid } from '@material-ui/core';
import { useUpsertRecord } from '../form/useUpsertRecord';
import { CInputProps, CListProps, CListTypes } from '../../core-domain/page';
import CListPropsSchema from '../../core-domain/json-schemas/CListProps.json';
import { ListActions } from './ListActions';
import { useTraceUpdate } from '../../useTraceRenders';
import { getCInputPropsFromFieldDef, getDefaultReferenceText } from '../defaultEditPageContent';

export function CList(nP: CListProps & { children: null | React.ReactNode }) {
    // useTraceUpdate(CList.name, nP);
    const {
        connectors: { connect },
    } = useNode((node) => ({ node }));

    const translate = useTranslate();
    const listContext = useListContext();

    return (
        <div className="" ref={connect}>
            {nP.isSubListOf && <SubList key="sublist" {...nP} />}
            {!nP.isSubListOf && !listContext && <span>{translate('waiting for list context...')}</span>}
            {!nP.isSubListOf && listContext && <RawList key="list" {...nP} />}
        </div>
    );
}
CList.displayName = 'CList';

export function SubList({
    children = null as null | React.ReactNode,
    ...nP
}: CListProps & { children: null | React.ReactNode }) {
    const {
        connectors: { connect },
    } = useNode((node) => ({ node }));

    const location = useLocation();
    let pageData = parseLocation(location.pathname);
    let res: string;
    let parentResourceId: string | undefined;
    if (nP.isSubListOf) {
        res = nP.isSubListOf;
        for (let pathSegment of pageData.parsedPath) {
            if (pathSegment.resourceName == res) {
                parentResourceId = pathSegment.resourceId;
            }
        }
    } else {
        res = pageData.parsedPath[0]?.resourceName || 'cform_no_resource';
        parentResourceId = pageData.parsedPath[0]?.resourceId;
    }

    console.debug('SubList for ', parentResourceId, nP);

    return <Grid item className="" ref={connect}>
        {parentResourceId && <RefManyField parentResourceId={parentResourceId} {...nP} children={children} />}
    </Grid>;
};

const RefManyField = ({
    children = null as null | React.ReactNode,
    parentResourceId,
    ...nP
}: CListProps & { children: null | React.ReactNode } & { parentResourceId: string }) => {
    const notify = useNotify();
    const { data: record } = useGetOne<Record>(
        nP.isSubListOf!,
        parentResourceId,
        {
            action: CRUD_GET_ONE,
            onFailure: () => {
                notify('ra.notification.item_doesnt_exist', 'warning');
                // redirect('list', basePath);
                // refresh();
            },
        }
    );

    console.log('SubListOf ', nP.isSubListOf, 'fkey', nP.refToParentListFieldName, 'record', parentResourceId, record);

    return <ReferenceManyField basePath={nP.isSubListOf} record={record} addLabel={false}
        reference={nP.resource!} target={nP.refToParentListFieldName!} sort={{ field: 'id', order: 'ASC' }}
    >
        <RawList {...nP} children={children} refToParentListFieldName={nP.refToParentListFieldName} parentResourceId={parentResourceId} />
    </ReferenceManyField>
}

export function RawList({
    children = null as null | React.ReactNode,
    refToParentListFieldName,
    parentResourceId,
    resource,
    fields,
    ...nP
}: CListProps & { children: null | React.ReactNode } & { parentResourceId?: string }) {
    const { ids, data, resource: resourceFromContext, ...restProps } = useListContext();

    const { resourceWithFields, onUpsertRecord } = useUpsertRecord(resource || resourceFromContext);

    const displayedFields = fields && fields.length > 0 ? fields
        : resourceWithFields.field_defs
            .filter(fieldDef => !DEFAULT_COLS.includes(fieldDef.name))
            .map(fieldDef => {
                let c = getCInputPropsFromFieldDef(resourceFromContext, fieldDef);
                if (c.cInputType === "Reference") {
                    const refedRes = resourceWithFields.refedResWithFields?.[c.reference];
                    if (refedRes) {
                        let refText = getDefaultReferenceText({
                            id: refedRes.id,
                            field_defs: refedRes.field_defs,
                        });
                        c.referenceText = refText;
                        console.log('XXXXXXX', resourceFromContext, resourceWithFields, refedRes.id, refText);
                    }
                }
                return c;
            });

    let haveActions = nP.enabledActions && nP.enabledActions.length > 0;

    console.debug("resource", resource, resourceFromContext, "displayedFields", displayedFields);

    return <>
        {haveActions && <ListActions isSubListOf={nP.isSubListOf}
            enabledActions={nP.enabledActions}
            fields={fields}
            refToParentListFieldName={refToParentListFieldName}
            parentResourceId={parentResourceId}
        />}
        {ids && ids[0] && nP.cListType == 'Tabs' &&
            <ListTabs ids={ids} data={data}
                resource={resource || resourceFromContext}
                labelSource={nP.labelSource}
                children={children} />}
        {ids && ids[0] && nP.cListType == 'Table' &&
            <ListTable editable={nP.editable}
                resource={resource || resourceFromContext}
                fields={displayedFields} resourceCols={resourceWithFields.field_defs}
                onRecordEdited={onUpsertRecord}
                isSubListOf={nP.isSubListOf}
                {...(restProps as any)}
            />
        }
        {ids && ids[0] && nP.cListType == 'Datagrid' &&
            <ListDatagrid editable={nP.editable} fields={displayedFields}
                resource={resource || resourceFromContext}
                labelSource={nP.labelSource}
                resourceCols={resourceWithFields.field_defs}
                onRecordEdited={onUpsertRecord}
            />
        }
        {ids && ids[0] && nP.cListType == 'FormList' &&
            <ListFormList ids={ids} data={data}
                resource={resource || resourceFromContext}
                children={children} />}
        {(!ids || !ids[0]) && <span>Loading ...</span>}
    </>;
}
RawList.displayName = 'RawList';

const CListSettingSchema = CListPropsSchema as JSONSchema7;
console.log('CListPropsSchema=', CListPropsSchema);
const uiSchema = {
    fields: {
        items: {
            'ui:anyOfDiscriminatorField': 'cInputType',
        }
    },
    enabledActions: {
        items: {
            'ui:anyOfDiscriminatorField': 'actionType',
        }
    }
}
export const CListSettings = () => {
    return <CmpSettings uiSchema={uiSchema} schema={CListSettingSchema} />
};

const CListDefaultProps: CListProps = {
    cListType: 'Table',
    resource: 'frmdb_pages',
    labelSource: 'id',
    editable: false as boolean,
};

const craft: CmpCraftStatic = {
    displayName: 'List',
    props: CListDefaultProps,
    related: {
        settings: CListSettings,
    },
    rules: {
    },
};
CList.craft = craft;
