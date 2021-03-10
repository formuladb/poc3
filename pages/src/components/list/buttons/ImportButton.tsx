import React, { useEffect, useState, InputHTMLAttributes } from 'react';
import { FileInput, Record, TextInput, useDataProvider, useNotify, useRefresh, useTranslate } from 'react-admin';
import Button from '@material-ui/core/Button';
import ImportExportIcon from '@material-ui/icons/ImportExport';
import CancelIcon from '@material-ui/icons/Close';
import OkIcon from '@material-ui/icons/Check';
import Popper from '@material-ui/core/Popper';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import { Fab } from '@material-ui/core';
import { RawForm, RawFormProps } from '../../form/CForm';
import { ActionIMPORTDATA, CInputProps, CListProps } from '../../../core-domain/page';
import { useResourceWithFields } from '../../form/useResourceWithFields';
import { Form, Field } from 'react-final-form';
import { FORM_ERROR } from 'final-form';
import parse from 'csv-parse/lib/es5';
import { IMPORTDATA } from '../../../core-functions/actions/IMPORTDATA';
import { FrmdbDataProvider } from '../../../ra-data-postgrest';


export function ImportButton({
    resource,
    fieldMappings,
    refToParentListFieldName,
    parentResourceId,
}: Pick<ActionIMPORTDATA, 'fieldMappings'> & { resource: string, refToParentListFieldName?, parentResourceId?}) {
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const refresh = useRefresh();
    const translate = useTranslate();

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const open = Boolean(anchorEl);
    const id = open ? `${resource}-import-popper` : undefined;
    const dataProvider = useDataProvider() as FrmdbDataProvider;
    const resourceWithFields = useResourceWithFields(resource);
    const notify = useNotify();

    const onSubmit = (values) => {
        console.log(values);
        const file = values.inputFile[0];
        if (file) {
            var reader = new FileReader();
            reader.readAsText(file, "UTF-8");
            reader.onload = function (evt) {
                console.log(values, evt?.target?.result);
                parse((evt?.target?.result as string) || '', { delimiter: '|' },
                    async function (err, output) {
                        if (err) { console.error(err); return }
                        else {
                            console.log(values, evt?.target?.result, output);
                            IMPORTDATA(
                                dataProvider,
                                resourceWithFields,
                                fieldMappings,
                                output,
                                refToParentListFieldName,
                                parentResourceId
                            ).then(res => {
                                notify(translate(`Import ok`), 'info');
                                refresh();
                            }).catch(err => {
                                notify(err, 'error');
                                refresh();
                            });
                        }
                    }
                )
            }
            reader.onerror = function (evt) {
                console.error(values, evt);
            }
        }
        if (true) {
            setAnchorEl(null);
        }
    };

    return (
        <div>
            <Tooltip title={translate('import')}>
                <Button aria-describedby={id} variant="text" color="primary" onClick={handleClick}>
                    <ImportExportIcon />
                </Button>
            </Tooltip>
            <Popper
                id={id}
                open={open}
                anchorEl={anchorEl}
                placement="bottom-start"
                style={{ zIndex: 1, minWidth: "35vw", maxWidth: "90vw" }}
            >
                <Paper elevation={3} >
                    <Box padding={2}>
                        <Form
                            onSubmit={onSubmit}
                            render={({ handleSubmit }) => (
                                <form onSubmit={handleSubmit}>
                                    <Grid direction="column">
                                        <FileField name="inputFile" />

                                        <Grid direction="row">
                                            <Button type="submit"><OkIcon /></Button>
                                            <Button type="submit" onClick={() => setAnchorEl(null)}><CancelIcon /></Button>
                                        </Grid>
                                    </Grid>
                                </form>
                            )}
                        />
                    </Box>
                </Paper>
            </Popper>
        </div>
    );
}

interface FileFieldProps extends InputHTMLAttributes<HTMLInputElement> {
    name: string;
}
const FileField = ({ name, ...props }: FileFieldProps) => {
    const translate = useTranslate();
    const [msg, setMsg] = useState(translate("upload file"));

    return <Field<FileList> name={name}>
        {({ input: { value, onChange, ...input } }) => (
            <Button
                variant="contained"
                component="label"
            >
                {msg}
                <input
                    {...input}
                    type="file"
                    hidden
                    onChange={({ target }) => {
                        const fileName = target.files?.[0].name;
                        if (fileName) setMsg(fileName);
                        return onChange(target.files);
                    }} // instead of the default target.value
                    {...props}
                />
            </Button>

        )}
    </Field>;
}