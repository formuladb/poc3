import React from 'react';
import { useListContext, useTranslate } from "react-admin";
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { CInputProps } from '../../core-domain/page';
import { FField } from '../form/FField';
import { FieldType } from '../../core-domain/fields';
import { EditButtonPopoverField } from './buttons/EditButtonPopoverFieldProps';

interface MobileListProps {
    fields: CInputProps[];
    editable?: boolean;
}
export function MobileList({
    fields,
    editable,
}: MobileListProps) {
    const { ids, data, basePath, resource } = useListContext();

    function getFieldType(field: CInputProps) {
        let fieldType: FieldType;
        if (field.cInputType === "Reference"
            || field.cInputType === "Select"
            || field.cInputType === "Lookup"
        ) {
            fieldType = "TextField"
        }
        else {
            fieldType = field.cInputType;
        };
        return fieldType;
    }
    const translate = useTranslate();

    return (
        <div style={{ margin: '1em' }}>
            {ids.map(id =>
                <Box key={id} borderColor="secondary.main" borderBottom={1}>
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
                </Box>
            )}
        </div>
    );
};