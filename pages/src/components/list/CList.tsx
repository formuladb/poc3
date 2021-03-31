import { Node as CraftJsNode, useNode } from '@craftjs/core';
import React, { useEffect, useState, FC, cloneElement, Children, useMemo } from 'react';
import {
    RecordMap, useListContext, Record,
    useCreate, useNotify,
    DatagridProps,
    useGetOne,
    CRUD_GET_ONE,
    ReferenceManyField,
    useTranslate,
    ResourceContextProvider,
    ListContextProvider,
    useReferenceManyFieldController,
    ReferenceManyFieldProps,
    sanitizeFieldRestProps,
    Translate,
    ListControllerProps,
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
import { useTraceRenders } from '../../useTraceRenders';
import { getCInputPropsFromFieldDef, getDefaultReferenceText } from '../defaultEditPageContent';
import { useRawFormContext } from '../form/useRawFormContext';
import { FrmdbResourceWithFields } from '../../core-domain/records';

export function CList(nP: CListProps & { children: null | React.ReactNode }) {
    const craftNode = useNode();
    const translate = useTranslate();
    const listContext = useListContext();
    useTraceRenders('CList', { nP, craftNode, translate, listContext });

    const {
        connectors: { connect },
    } = craftNode;

    const extraProps = {
        connect,
        translate,
        listContext,
    };

    return <CListInternalMemo {...nP} {...extraProps} />;
}
CList.displayName = 'CList';

const CListInternalMemo = React.memo(CListInternal);

function CListInternal(props: CListProps & { 
    children: null | React.ReactNode,
    connect: any,
    translate: Translate,
    listContext: ListControllerProps<Record>,
}) {

    const {
        children,
        connect,
        translate,
        listContext,
        ...nP
    } = props;

    return (
        <div className="" ref={connect}>
            {nP.isSubListOf && <SubList key="sublist" {...nP} children={children} />}
            {!nP.isSubListOf && !listContext && <span key="loading">{translate('waiting for list context...')}</span>}
            {!nP.isSubListOf && listContext && <RawList key="list" {...nP} children={children} />}
        </div>
    );
}
CListInternal.displayName = 'CListInternal';

export function SubList({
    children = null as null | React.ReactNode,
    ...nP
}: CListProps & { children: null | React.ReactNode }) {
    const {
        connectors: { connect },
    } = useNode((node) => ({ node }));

    const location = useLocation();
    const rawFormContext = useRawFormContext();

    let pageData = parseLocation(location.pathname);
    let res: string;
    let parentResourceId: string | undefined = undefined;
    if (nP.isSubListOf) {
        res = nP.isSubListOf;
        for (let pathSegment of pageData.parsedPath) {
            if (pathSegment.resourceName == res) {
                parentResourceId = pathSegment.resourceId;
            }
        }
        if (undefined === parentResourceId && rawFormContext.record && nP.refToParentListFieldName) {
            parentResourceId = rawFormContext.record.id + '';
        }
    } else {
        res = pageData.parsedPath[0]?.resourceName || 'cform_no_resource';
        parentResourceId = pageData.parsedPath[0]?.resourceId;
    }

    //console.debug('SubList for ', parentResourceId, nP, rawFormContext);

    return <Grid item className="" ref={connect}>
        {parentResourceId && <RefManyField parentResourceId={parentResourceId} {...nP} children={children} />}
    </Grid>;
};


const RefManySort = { field: 'id', order: 'ASC' };
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

    return <ReferenceManyField basePath={nP.isSubListOf} record={record} addLabel={false}
        reference={nP.resource!} target={nP.refToParentListFieldName!}
        sort={RefManySort}
        perPage={50}
    >
        <RawList {...nP} children={children} refToParentListFieldName={nP.refToParentListFieldName} parentResourceId={parentResourceId} />
    </ReferenceManyField>
}

export function RawList(props: CListProps & { 
    children: null | React.ReactNode,
    parentResourceId?: string,
}) {
    const {
        children = null as null | React.ReactNode,
        refToParentListFieldName,
        parentResourceId,
        resource,
        fields,
        ...nP
    } = props;
    const listContext = useListContext();;
    const { ids, data, resource: resourceFromContext, ...restListContextProps } = listContext;
    const translate = useTranslate();
    const { resourceWithFields, onUpsertRecord } = useUpsertRecord(resource || resourceFromContext);

    const displayedFields = useMemo(() => fields && fields.length > 0 ? fields
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
                    }
                }
                return c;
            }),
        [fields, resourceFromContext, resourceWithFields]
    );

    let haveActions = nP.enabledActions && nP.enabledActions.length > 0;

    const extraProps = {
        children,
        refToParentListFieldName,
        parentResourceId,
        resource,

        listContext,
        haveActions,
        displayedFields,
        resourceWithFields,
        onUpsertRecord,
        translate,
    };

    return <MemoizedRawListInternal {...nP} {...extraProps} />;
}
RawList.displayName = 'RawList';

const MemoizedRawListInternal = React.memo(RawListInternal);
function RawListInternal(props: CListProps & { 
    children: null | React.ReactNode,
    parentResourceId?: string,


    listContext: ListControllerProps<Record>,
    haveActions: boolean | undefined,
    displayedFields: CInputProps[],
    resourceWithFields: FrmdbResourceWithFields,
    onUpsertRecord: (data: Partial<Record>) => Promise<void>,
    translate: Translate,
}) {

    const {
        children = null as null | React.ReactNode,
        refToParentListFieldName,
        parentResourceId,
        resource,
        fields,

        listContext,
        haveActions,
        displayedFields,
        resourceWithFields,
        onUpsertRecord,
        translate,

        ...nP
    } = props;

    const { ids, data, resource: resourceFromContext, ...restListContextProps } = listContext;

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
                {...(restListContextProps as any)}
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
        {(!ids || !ids[0]) && <span>{translate('no elements yet')}</span>}
    </>;
}
RawListInternal.displayName = 'RawListInternal';

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
