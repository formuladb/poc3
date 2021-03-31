import {
    Checkbox,
    Table,
    TableProps,
    TableCell,
    TableHead,
    TableBody,
    TableRow,
} from '@material-ui/core';
import React from 'react';
import { CInputProps } from '../../core-domain/page';
import { ListContextMemoizer } from './ListContextMemoizer';
import { ListControllerProps, useTranslate, Record, translate } from "react-admin";
import { FField } from '../form/FField';


interface SubDatagridProps {
    fields: CInputProps[];
    children: null | React.ReactNode,
}
export function DesktopTable(props: SubDatagridProps) {
    return <ListContextMemoizer>
        <DesktopTableInternal {...props} />
    </ListContextMemoizer>;
}
function DesktopTableInternal({
    fields,
    listContext
}: SubDatagridProps & { listContext?: ListControllerProps<Record> }) {

    if (!listContext) throw new Error("listContext is missing");
    const { ids, data, basePath, resource } = listContext;
    const translate = useTranslate();

    return <Table>
        <TableHead>
            <TableRow>
                {fields.map(field => {
                    return <TableCell>{translate(`resources.${resource}.fields.${field.source}`)}</TableCell>
                })}
            </TableRow>
        </TableHead>
        <TableBody>
            {ids.map(id => {
                const record = data[id];
                return <TableRow key={id}>
                    {fields.map(field => {
                        return <TableCell><FField field={field} record={record} /></TableCell>
                    })}
                </TableRow>
            })}
        </TableBody>
    </Table>;
}
