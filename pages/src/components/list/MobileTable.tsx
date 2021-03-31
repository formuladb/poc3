import React from 'react';
import { ListControllerProps, useTranslate, Record } from "react-admin";
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { CInputProps } from '../../core-domain/page';
import { FField } from '../form/FField';
import { EditButtonPopoverField } from './buttons/EditButtonPopoverFieldProps';
import { ListContextMemoizer } from './ListContextMemoizer';

interface MobileListProps {
    fields: CInputProps[];
    editable?: boolean;
}
export function MobileTable(props: MobileListProps) {
    return <ListContextMemoizer>
        <MobileListInternal {...props} />
    </ListContextMemoizer>;
}
function MobileListInternal({
    fields,
    editable,
    listContext,
}: MobileListProps & { listContext?: ListControllerProps<Record> }) {
    if (!listContext) throw new Error("listContext is missing");
    const { ids, data, basePath, resource } = listContext;

    const translate = useTranslate();

    return (
        <div style={{ margin: '1em' }}>
            {ids.map(id =>
                <div key={id} style={{borderBottom: "1px solid grey"}}>
                    <Grid container spacing={1} direction="column" >
                        {fields.map((field, idx) =>
                            <Grid key={field.source} item container direction="row" wrap="nowrap" justify="space-between">
                                <Grid key="label" item style={{display: "flex", flexWrap: "nowrap"}}>
                                    {editable && idx === 0 && 
                                        <EditButtonPopoverField key="edit-btn" record={data[id]} resource={resource} fields={fields} />}

                                    <Typography key="label-text" variant="subtitle1" >
                                        {translate(`resources.${resource}.fields.${field.source}`) + ": "}
                                    </Typography>
                                </Grid>
                                <Grid key="value" item>
                                    <FField field={field} />
                                </Grid>
                            </Grid>
                        )}
                    </Grid>
                </div>
            )}
        </div>
    );
};