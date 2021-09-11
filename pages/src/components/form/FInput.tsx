import React from 'react';

import {
    BooleanInput,
    DateInput,
    FileInput,
    ImageInput,
    NumberInput,
    TextInput,
} from 'react-admin';
import { FieldType } from "../../core/entity/fields";

type FInputProps = { type: FieldType }
    & Parameters<typeof TextInput>[0]
    & Parameters<typeof BooleanInput>[0]
    & Parameters<typeof ImageInput>[0]
    ;
export function FInput({ type, ...props }: FInputProps) {

    return (<>
        {type === 'TextField' && <TextInput {...props} />}
        {type === 'BooleanField' && <BooleanInput {...props} />}
        {type === 'ChipField' && <TextInput {...props} />}
        {type === 'DateTimeField' && <DateInput {...props} />}
        {type === 'EmailField' && <TextInput {...props} />}
        {type === 'ImageField' && <ImageInput {...props} ><Img /></ImageInput>}
        {type === 'FileField' && <FileInput {...props} />}
        {type === 'NumberField' && <NumberInput {...props} />}
        {type === 'RichTextField' && <TextInput {...props} />}
        {type === 'UrlField' && <TextInput {...props} />}
    </>);
}

const Img = ({ record }: { record?: string | { rawFile: File } }) => {
    let srcUrl: string;
    if (!record) {
        srcUrl = '';
    } else if (typeof record == "string") {
        srcUrl = record;
    } else {
        srcUrl = URL.createObjectURL(record.rawFile);
    }
    console.log(record instanceof File, srcUrl, record);
    return <img src={srcUrl} style={{ width: '200px' }}></img>;
};
