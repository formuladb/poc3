import React from 'react';
import { useTheme, useMediaQuery } from '@material-ui/core';
import Table from '@material-ui/core/Table';
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
import { MobileTable } from './MobileTable';
import { getFieldLabel } from '../field-utils';
import { useTraceRenders } from '../../useTraceRenders';
import { ListContextMemoizer } from './ListContextMemoizer';
import { DesktopTable } from './DesktopTable';

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
    refToParentListFieldName,
    parentResourceId,
    resourceCols,
    onRecordEdited,
    ...props
}: ListDatagridProps) => {

    const theme = useTheme();
    const mdScreen = useMediaQuery(theme.breakpoints.up('md'), { noSsr: true });

    return <>
        {!mdScreen && <MobileTable fields={fields} editable={editable} />}
        {mdScreen &&
            (!isSubListOf ?
                <Datagrid hasBulkActions={true} {...props}>
                    {editable && !isSubListOf && <GoToEditPageButton resource={resource} />}
                    {fields.map(field => {
                        return <FieldWrapper label={getFieldLabel(resource, field)} field={field} key={field.source} />
                    })}
                </Datagrid>
                :
                <DesktopTable fields={fields} editable={editable}
                    refToParentListFieldName={refToParentListFieldName}
                    parentResourceId={parentResourceId}
                />
            )
        }
    </>;
};

function FieldWrapper({ label, field, ...rest }: { label: string, field: CInputProps }) {
    return <FField field={field} key={field.source} {...rest} />
}
