import React from 'react';

import {
    TextField,
    BooleanField,
    ChipField,
    DateField,
    EmailField,
    ImageField,
    FileField,
    NumberField,
    RichTextField,
    UrlField,
    TextFieldProps,
    ChipFieldProps,
    ReferenceField,
} from 'react-admin';
import { makeStyles } from '@material-ui/core';

import { FieldType } from "../../core-domain/fields";
import { CInputProps } from '../../core-domain/page';

const useStyles = makeStyles({
    imageField: {
        '& img': {
            height: 60,
            width: 60,
            objectFit: "contain",
            transition: 'all .2s ease-in-out',
            "&:hover": {
                transform: 'scale(5)',
            }
        }
    }
});

export function FField({ field, ...props }: { field: CInputProps, record? }) {
    const classes = useStyles();

    return (<>
        { field.cInputType == 'TextField' && <TextField source={field.source}  {...props} />}
        { field.cInputType == 'BooleanField' && <BooleanField source={field.source}  {...props} />}
        { field.cInputType == 'ChipField' && <ChipField source={field.source}  {...props} />}
        { field.cInputType == 'DateTimeField' && <DateField source={field.source}  {...props} />}
        { field.cInputType == 'EmailField' && <EmailField source={field.source}  {...props} />}
        { field.cInputType == 'ImageField' && <ImageField source={field.source}  {...props} className={classes.imageField} />}
        { field.cInputType == 'FileField' && <FileField source={field.source}  {...props} />}
        { field.cInputType == 'NumberField' && <NumberField source={field.source}  {...props} />}
        { field.cInputType == 'RichTextField' && <RichTextField source={field.source}  {...props} />}
        { field.cInputType == 'UrlField' && <UrlField source={field.source}  {...props} />}
        { field.cInputType == 'Reference' &&
            <ReferenceField source={field.source}  {...props} reference={field.reference} >
                <TextField source={field.referenceText} />
            </ReferenceField>}
    </>);
}
