import React, { useCallback, useContext, useState } from "react";
import { useForm, useFormState } from 'react-final-form';
import {
    AutocompleteInput,
    RadioButtonGroupInput,
    ReferenceInput,
    TextInput,
    Validator,
} from "react-admin";
import { cloneDeep } from 'lodash';
import { CInputLookupProps, CInputProps, CInputReferenceProps } from "../../core-domain/page";
import { RawFormContext, RawFormContextData, useRawFormContext } from "./useRawFormContext";
import { useResourceWithFields } from "./useResourceWithFields";
import { getDefaultReferenceText } from "../defaultEditPageContent";

const DefaultRefState = {
    reference: undefined as undefined | string,
    relatedFieldsOptText: {} as { [source: string]: string },
}

function useLookupContext(nP: CInputLookupProps | CInputReferenceProps) {
    const form = useForm();
    let rawFormContext = useRawFormContext();
    let inputs = rawFormContext.inputs;

    const refState = cloneDeep(DefaultRefState);
    for (let otherInputProps of Object.values(inputs)) {
        if (otherInputProps.cInputType === "Reference"
            && otherInputProps.resource == nP.resource
            && otherInputProps.source == (nP.cInputType === "Lookup" ? nP.referenceField : nP.source)
        ) {
            refState.reference = otherInputProps.reference;
        }
    }

    if (refState.reference) {
        for (let otherInputProps of Object.values(inputs)) {
            if (otherInputProps.cInputType === "Lookup"
                && otherInputProps.referenceField === (nP.cInputType === "Lookup" ? nP.referenceField : nP.source)
            ) {
                refState.relatedFieldsOptText[otherInputProps.source] = otherInputProps.referenceText;
            }
            if (otherInputProps.cInputType === "Reference"
                && otherInputProps.source === (nP.cInputType === "Lookup" ? nP.referenceField : nP.source)
                && otherInputProps.referenceText
            ) {
                refState.relatedFieldsOptText[otherInputProps.source] = otherInputProps.referenceText;
            }
        }
    }

    const propagateValueChange = (selectedItem: any) => {
        if (!selectedItem) return;
        for (let [relatedSource, relatedReferenceText] of Object.entries(refState.relatedFieldsOptText)) {
            form.change(relatedSource, selectedItem[relatedReferenceText]);
        }
    }

    console.debug('LazyReferenceAutocompleteInput:', 'rawFormContext', rawFormContext, 'nP', nP,
        'refState', refState, "form values", form.getState().values);

    return { reference: refState.reference, propagateValueChange };
}


export function LookupInput({
    validate,
    ...nP
}: CInputLookupProps & { validate: Validator | Validator[] }) {

    const [enableEdit, setEnableEdit] = useState(false);
    const { reference, propagateValueChange } = useLookupContext(nP);

    return (
        <>
            {enableEdit && reference && <span key="ref" style={{ display: enableEdit ? "inline-block" : "none" }}>
                <ReferenceInput
                    resource={nP.resource}
                    source={nP.source}
                    reference={reference}
                    filterToQuery={(searchText: any) => ({ [`${nP.referenceText}@ilike`]: searchText })}
                    onChange={ev => { setEnableEdit(true) }}
                    onBlur={ev => { setEnableEdit(false) }}
                    fullWidth={true}
                >
                    <AutocompleteInput fullWidth={true} optionText={nP.referenceText} optionValue="id"
                        onSelect={(selectedItem) => propagateValueChange(selectedItem)}
                    />
                </ReferenceInput>
            </span>}
            {!enableEdit && <span key="input" style={{ display: enableEdit ? "none" : "inline-block" }}>
                <TextInput
                    disabled fullWidth={true}
                    resource={nP.resource}
                    source={nP.source}
                    onClick={ev => reference && setEnableEdit(true)}
                    helperText="i18nt.click_to_edit"
                    variant={nP.variant}
                    validate={validate}
                />
            </span>}
        </>
    );
};

export function FReferenceInputAsync({
    validate,
    ...nP
}: CInputReferenceProps & { validate: Validator }) {
    const referenceWithFields = useResourceWithFields(nP.reference);
    const referenceText = getDefaultReferenceText(referenceWithFields);
    return <FReferenceInput {...nP} referenceText={referenceText} validate={validate} />
}

export function FReferenceInput({
    validate,
    ...nP
}: CInputReferenceProps & { validate: Validator }) {
    const { propagateValueChange } = useLookupContext(nP);
    
    let rawFormContext = useRawFormContext();
    let extraFilter = {};
    if (nP.matchingColumn && rawFormContext.record) {
        const matchingValue = rawFormContext.record[nP.matchingColumn];
        extraFilter = {
            [nP.matchingColumn]: matchingValue
        };
    }

    const filterToQuery = searchText => ({ 
        ...extraFilter,
        [`${nP.referenceText}@ilike`]: searchText,
    });
    return (
        <ReferenceInput key={nP.referenceText} resource={nP.resource} source={nP.source}
            reference={nP.reference}
            variant={nP.variant} disabled={nP.disabled} fullWidth={true}
            filterToQuery={filterToQuery}
            validate={validate}
        >
            {nP.referenceInputType === "radio_button" ?
                <RadioButtonGroupInput key="radio_button" optionText={choice => nP.referenceText ? choice[nP.referenceText] + '' : ''}
                    fullWidth={true} optionValue="id"
                    onSelect={(selectedItem) => propagateValueChange(selectedItem)}
                    row={nP.layout === "single_row" ? true : false}
                />
                :
                <AutocompleteInput key="autocomplete" optionText={choice => nP.referenceText ? choice[nP.referenceText] + '' : ''}
                    fullWidth={true} optionValue="id"
                    onSelect={(selectedItem) => propagateValueChange(selectedItem)}
                />
            }
        </ReferenceInput>
    );
}