import React, { useState, ReactText, useEffect } from 'react';

import {
    BooleanField, ChipField, DateField, EmailField, FileField,
    ImageField, NumberField, TextField, UrlField,
    Record, useCreate, useNotify, useListContext, useTranslate, ListControllerProps,
} from 'react-admin';
import { ResourceFieldDef } from '../../core-domain/fields';
import { cloneDeep } from 'lodash';

import { FilterChangedEvent, ICellRendererParams } from '@ag-grid-community/core';
import { AgGridColumn, AgGridReact } from '@ag-grid-community/react';
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";

import '@ag-grid-community/core/dist/styles/ag-grid.css';
import '@ag-grid-community/core/dist/styles/ag-theme-alpine.css';
import { CInputProps, CListProps } from '../../core-domain/page';

import { GoToEditPageButton } from './buttons/GoToEditPageButton';
import { FField } from '../form/FField';
import { ListContextMemoizer } from './ListContextMemoizer';

const HEADER_HEIGHT = 50;
const ROW_HEIGHT = 40;

type AgDatagridProps = Omit<CListProps, 'cListType'> & {
    fields: Exclude<CListProps['fields'], undefined>
} & {
    resourceCols: ResourceFieldDef[],
    onRecordEdited: (data: Record) => void,
};
export function ListDatagrid(props: AgDatagridProps) {
    return <ListContextMemoizer>
        <ListDatagridInternal {...props} />
    </ListContextMemoizer>;
}
function ListDatagridInternal({
    fields,
    editable = false as boolean,
    resourceCols,
    onRecordEdited,
    listContext,
}: AgDatagridProps & { listContext?: ListControllerProps<Record> }) {
    if (!listContext) throw new Error("listContext is missing");
    const {
        ids, data, resource,
        setFilters,
    } = listContext;

    const translate = useTranslate();
    const [gridApi, setGridApi] = useState(null);
    const [gridColumnApi, setGridColumnApi] = useState(null);

    const [rowData, setRowData] = useState(ids.map(id => data[id]));

    useEffect(() => {
        setRowData(ids.map(id => data[id]));
    }, [ids, data, resource]);

    const onRowValueChanged = async event => {
        var data = cloneDeep(event.data);
        onRecordEdited(data);
    };

    const onFilterChanged = (event: FilterChangedEvent) => {
        let filterModel = event.api.getFilterModel();
        console.log(filterModel);
    }

    const cellComponents = {};
    fields.map(field => {
        cellComponents[`${field.source}Renderer`] = (props: ICellRendererParams) => {
            return <div style={{display: "flex", flexWrap: "nowrap", alignItems: "center"}}>
                {editable && "id" == props.column.getId() && <GoToEditPageButton resource={resource} record={props.data} />}
                <FField field={field} record={props.data} />
            </div>;
        }
    });

    return (
        <div className="ag-theme-alpine" style={{ height: Math.min(550, HEADER_HEIGHT * 2 + rowData.length * ROW_HEIGHT + 20), width: '100%' }}>
            <AgGridReact
                frameworkComponents={cellComponents}
                modules={[ClientSideRowModelModule]}
                rowData={rowData}
                editType="fullRow"
                floatingFilter={false}
                onRowValueChanged={onRowValueChanged}
                onFilterChanged={onFilterChanged}
                enableCellTextSelection={true}
                ensureDomOrder={true}
            >
                {fields.map(field => {
                    return <AgGridColumn
                        editable={editable}
                        field={field.source}
                        key={getKey(field)}
                        headerName={translate(`resources.${resource}.fields.${field.source}`)}
                        cellRenderer={`${field.source}Renderer`}
                        filter={false}
                        resizable={true}
                        pinned={'id' === field.source ? 'left' : undefined}
                    // cellEditor={col.type + 'Editor'}
                    />;
                })}
            </AgGridReact>
        </div>
    );
};

function getKey(field: CInputProps) {
    return field.source + (field.cInputType === "Reference" ? field.referenceText : '');
}
