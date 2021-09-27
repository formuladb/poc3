import React, { useState } from 'react';
import { cloneDeep } from 'lodash';
import {
    TextInput,
    NumberInput,
    SelectInput,
    DateInput,
    DateTimeInput,
    NullableBooleanInput,
    ImageInput,
} from 'react-admin';
import RichTextInput from 'ra-input-rich-text';

import { Node as CraftJsNode, useNode, useEditor } from '@craftjs/core';
import { CmpSettings } from '../editor/CmpSettings';
import { JSONSchema7, JSONSchema7Definition } from 'json-schema';
import { CForm } from './CForm';
import { CmpCraftStatic } from '../utils';
import { Grid } from '@material-ui/core';
import { LookupInput, FReferenceInput, FReferenceInputAsync } from './LookupReferenceInput';
import { CList } from '../list/CList';
import { CInputProps } from '../../core/entity/page';
import { useRawFormContext } from './useRawFormContext';
import { useValidators } from './useValidators';
import { getCInputSchema } from './post-processed-schemas';
import { JsonInput } from './JsonInput';

export const CInput = (nP: CInputProps) => {
    const { query } = useEditor();
    const {
        node,
        connectors: { connect },
    } = useNode((node) => ({ node }));

    const rawFormContext = useRawFormContext();
    rawFormContext.inputs[nP.source] = nP;
    const validators = useValidators(rawFormContext.resource, rawFormContext.fieldDefsByName, rawFormContext.isCreate);
    const validationFn = validators[nP.source];
    const fieldDef = rawFormContext.fieldDefsByName[nP.source];
    const isDisabled = nP.disabled || fieldDef?.c_is_computed /*|| nP.source === "id"*/;
    const initialValueFromUrl = rawFormContext.recordFieldsInUrl?.[nP.source];

    return <Grid item md={nP.width || 3} className="" ref={connect as (instance: HTMLDivElement | null) => void}>
        {nP.cInputType == 'TextField' && <TextInput size={nP.size} resource={nP.resource} source={nP.source} initialValue={nP.initialValue || initialValueFromUrl}
            variant={nP.variant} disabled={isDisabled} fullWidth={true} multiline={nP.multiline}
            validate={validationFn} />}
        {nP.cInputType == 'RichTextField' && <RichTextInput size={nP.size} resource={nP.resource} source={nP.source} initialValue={nP.initialValue || initialValueFromUrl}
            variant={nP.variant} disabled={isDisabled} fullWidth={true}
            options={nP.disabled ? {
                modules: { toolbar: false }, readOnly: true,
            } : undefined}
            validate={validationFn} />}
        {nP.cInputType == 'NumberField' && <NumberInput size={nP.size} resource={nP.resource} source={nP.source} initialValue={nP.initialValue || initialValueFromUrl}
            variant={nP.variant} disabled={isDisabled} fullWidth={true}
            validate={validationFn} />}
        {nP.cInputType == 'DateField' && <DateInput size={nP.size} resource={nP.resource} source={nP.source} initialValue={nP.initialValue || initialValueFromUrl}
            variant={nP.variant} disabled={isDisabled} fullWidth={true}
            validate={validationFn} />}
        {nP.cInputType == 'DateTimeField' && <DateTimeInput size={nP.size} resource={nP.resource} source={nP.source} initialValue={nP.initialValue || initialValueFromUrl}
            variant={nP.variant} disabled={isDisabled} fullWidth={true}
            validate={validationFn} />}
        {nP.cInputType == 'BooleanField' && <NullableBooleanInput size={nP.size} resource={nP.resource} source={nP.source} initialValue={nP.initialValue || initialValueFromUrl}
            variant={nP.variant} disabled={isDisabled} fullWidth={true}
            validate={validationFn} />}
        {nP.cInputType == 'ImageField' && <ImageInput resource={nP.resource} source={nP.source}
            variant={nP.variant} disabled={isDisabled} fullWidth={true}
            validate={validationFn} ><Img /></ImageInput>}
        {nP.cInputType == 'Select' && <SelectInput size={nP.size} resource={nP.resource} source={nP.source} initialValue={nP.initialValue || initialValueFromUrl}
            variant={nP.variant} disabled={isDisabled} fullWidth={true}
            translate={nP.translate}
            choices={nP.choices.map(c => ({ id: c, name: c }))}
            validate={validationFn} />}
        {nP.cInputType == 'Reference' && nP.referenceText &&
            <FReferenceInput {...nP} validate={validationFn} />}
        {nP.cInputType == 'Reference' && !nP.referenceText &&
            <FReferenceInputAsync {...nP} validate={validationFn} />}
        {nP.cInputType == 'Lookup' &&
            <LookupInput {...nP} validate={validationFn} />}
        {nP.cInputType == 'Json' && <JsonInput size={nP.size} resource={nP.resource} source={nP.source}
            variant={nP.variant} disabled={isDisabled} fullWidth={true} 
            multiline={true} rowsMax={20}
            validate={validationFn} />}
    </Grid>;
};
CInput.displayName = 'CInput';


const CInputSettingSchema = getCInputSchema() as JSONSchema7;
const uiSchema = {
    "ui:title": " ",
    cInputType: {
        "ui:widget": "hidden",
    }
}
export const CInputSettings = () => {
    return <CmpSettings uiSchema={uiSchema} schema={CInputSettingSchema} />
};


const CInputDefaultProps: CInputProps = {
    cInputType: "TextField",
    resource: "frmdb_resources",
    source: "id",
    variant: "standard",
    disabled: false,
};
const craft: CmpCraftStatic = {
    displayName: 'Field',
    props: CInputDefaultProps,
    related: {
        settings: CInputSettings,
    },
    rules: {
        canDrop(dropTarget, self, helpers): boolean {
            let parents = [dropTarget.data.type];
            for (let ancestorId of helpers(dropTarget.id).ancestors()) {
                parents.push(helpers(ancestorId).get().data.type);
            }
            console.log('CInput.canDrop', parents);
            for (let parent of parents) {
                console.log('CInput.canDrop', parent, parent === CForm || parent === CList);
                if (parent === CForm || parent === CList) return true;
            }
            return false;
        }
    },
};
CInput.craft = craft;


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
