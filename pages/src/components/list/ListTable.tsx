import React from 'react';
import { useTheme, useMediaQuery } from '@material-ui/core';
import {
    Datagrid, DatagridProps,
    Record,
    SimpleList
} from 'react-admin';
import { ResourceFieldDef } from '../../core-domain/fields';
import { FField } from '../form/FField';
import { CInputProps, CListProps } from '../../core-domain/page';
import { GoToEditPageButton } from './buttons/GoToEditPageButton';
import { EditButtonPopoverField } from './buttons/EditButtonPopoverFieldProps';
import { FieldType } from '../../core-domain/fields';
import { MobileList } from './MobileList';
import { getFieldLabel } from '../field-utils';
import { useTraceRenders } from '../../useTraceRenders';

type ListDatagridProps = CListProps & {
    fields: Exclude<CListProps['fields'], undefined>,
    refToParentListFieldName?: string,
    parentResourceId?: string,
} & {
    resourceCols: ResourceFieldDef[],
    onRecordEdited: (data: Record) => void,
} & DatagridProps;
export const ListTable = ({
    resource,
    fields,
    editable,
    isSubListOf,
    resourceCols,
    onRecordEdited,
    ...props
}: ListDatagridProps) => {

    const theme = useTheme();
    const mdScreen = useMediaQuery(theme.breakpoints.up('md'));
    useTraceRenders(ListTable.name, {theme, mdScreen});

    return <>
        {!mdScreen && <MobileList fields={fields} editable={editable} />}
        {mdScreen && <Datagrid {...props}>
            {editable && isSubListOf && <EditButtonPopoverField resource={resource} fields={fields} />}
            {editable && !isSubListOf && <GoToEditPageButton resource={resource} />}
            {fields.map(field => {
                return <FieldWrapper label={getFieldLabel(resource, field)} field={field} key={field.source} />
            })}
        </Datagrid>}
    </>;
};

function FieldWrapper({ label, field, ...rest }: { label: string, field: CInputProps }) {
    return <FField field={field} key={field.source} {...rest} />
}
