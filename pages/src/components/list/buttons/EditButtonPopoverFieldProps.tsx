import React, { useEffect, useState } from 'react';
import { DeleteButton, Record, TextInput, useDataProvider, useRefresh } from 'react-admin';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import CancelIcon from '@material-ui/icons/Close';
import Popper from '@material-ui/core/Popper';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { Fab } from '@material-ui/core';
import { RawForm, RawFormProps } from '../../form/CForm';
import { CInputProps, CListProps } from '../../../core-domain/page';
import { CInput } from '../../form/CInput';
import { useResourceWithFields } from '../../form/useResourceWithFields';
import { groupByUniqProp } from '../../utils';
import { defaultEditPageFields } from '../../defaultEditPageContent';

/**
 * @param source injected by Datagird
 * @param record injected by Datagird
 */
interface EditButtonPopoverFieldProps {
    resource: CListProps['resource'];
    fields: CListProps['fields'];
    record?: Record | undefined;
    isCreate?: boolean;
    refToParentListFieldName?: string;
    parentResourceId?: string;
}
export const EditButtonPopoverField = React.memo(EditButtonPopoverFieldInternal);
function EditButtonPopoverFieldInternal({
    resource,
    fields,
    record = undefined,
    isCreate = undefined,
    refToParentListFieldName = undefined,
    parentResourceId = undefined,
}: EditButtonPopoverFieldProps) {
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const refresh = useRefresh();

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const onSave: RawFormProps['onSave'] = (data, saveOk) => {
        if (saveOk) {
            setAnchorEl(null);
            refresh();
        }
    }

    const open = Boolean(anchorEl);
    const id = open ? `${resource}-edit-popper` : undefined;
    const resourceWithFields = useResourceWithFields(resource);

    const [displayedFields, setDisplayedFields] = useState<CInputProps[]>(fields || []);
    useEffect(() => {

        if (!fields || fields.length == 0) {
            const defaultFields = defaultEditPageFields(resourceWithFields, !!isCreate);
            setDisplayedFields(defaultFields.filter(
                fld => refToParentListFieldName !== fld.source
            ));
        }
    }, [resourceWithFields, fields]);
    const addHiddenIdField = !isCreate && !displayedFields.find(f => f.source == "id");

    //console.debug("resource", resource, "displayedFields", displayedFields);

    return (
        <div>
            <Button aria-describedby={id} variant="text" color="primary" onClick={handleClick}>
                {isCreate && <AddIcon />}
                {!isCreate && <EditIcon />}
            </Button>
            <DeleteButton resource={resource} record={record} label={''}
                mutationMode="pessimistic" redirect={false} size="small" />
            <Popper
                id={id}
                open={open}
                anchorEl={anchorEl}
                placement="bottom-start"
                style={{ zIndex: 1, minWidth: "35vw", maxWidth: "90vw" }}
            >
                <Paper elevation={3}>
                    <RawForm resource={resource} record={record} onSave={onSave}
                        refToParentListFieldName={refToParentListFieldName} parentResourceId={parentResourceId}
                    >
                        <Grid container spacing={1}>
                            {addHiddenIdField && <TextInput key="id" source="id" hidden={true} />}
                            {displayedFields.map(field =>
                                <CInput key={field.source} {...field}
                                    resource={resource} />
                            )}
                        </Grid>
                    </RawForm>
                    <div style={{ position: "relative" }}>
                        <Fab size="small" style={{ position: 'absolute', bottom: '5px', left: '50%' }} onClick={() => setAnchorEl(null)}>
                            <CancelIcon />
                        </Fab>
                    </div>
                </Paper>
            </Popper>
        </div>
    );
}
