import {
    Checkbox,
    Table,
    TableProps,
    TableCell,
    TableHead,
    TableBody,
    TableRow,
    Typography,
} from '@material-ui/core';
import React from 'react';
import { CInputProps } from '../../core/entity/page';
import { ListContextMemoizer } from './ListContextMemoizer';
import { ListControllerProps, useTranslate, Record, translate } from "react-admin";
import { FField } from '../form/FField';
import { EditButtonPopoverField } from './buttons/EditButtonPopoverFieldProps';


interface DesktopTableProps {
    editable?: boolean;
    fields: CInputProps[];
    refToParentListFieldName?: string;
    parentResourceId?: string;
}
export function DesktopTable(props: DesktopTableProps) {
    return <ListContextMemoizer>
        <DesktopTableInternal {...props} />
    </ListContextMemoizer>;
}
function DesktopTableInternal({
    editable,
    fields,
    listContext,
    refToParentListFieldName,
    parentResourceId,
}: DesktopTableProps & { listContext?: ListControllerProps<Record> }) {

    if (!listContext) throw new Error("listContext is missing");
    const { ids, data, basePath, resource } = listContext;
    const translate = useTranslate();

    return <Table>
        <TableHead>
            <TableRow>
                {editable && <TableCell></TableCell>}
                {fields.map(field => {
                    return <TableCell>
                        <Typography variant="subtitle2">
                            {translate(`resources.${resource}.fields.${field.source}`)}
                        </Typography>
                    </TableCell>
                })}
            </TableRow>
        </TableHead>
        <TableBody>
            {ids.map(id => {
                const record = data[id];
                return <TableRow key={id}>
                    {editable && <TableCell key="edit-btn">
                        <EditButtonPopoverField resource={resource} fields={fields} record={record}
                            refToParentListFieldName={refToParentListFieldName}
                            parentResourceId={parentResourceId}
                        />
                    </TableCell>}
                    {fields.map(field => {
                        return <TableCell><FField field={field} record={record} /></TableCell>
                    })}
                </TableRow>
            })}
        </TableBody>
    </Table>;
}
