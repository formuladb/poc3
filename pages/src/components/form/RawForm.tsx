import React, { useState, useMemo, useCallback } from 'react';
import {
    DeleteButton, FormWithRedirect, SaveButton,
    Record,
} from 'react-admin';
import { Toolbar, Grid } from '@material-ui/core';
import { useLocation, useRouteMatch } from 'react-router-dom';
import { useUpsertRecord } from './useUpsertRecord';
import { FormWithRedirectProps } from 'react-admin';
import { ActionSAVE, ActionDELETE, CFormProps, ActionREDIRECT, ActionSET } from '../../core-domain/page';
import { RawFormContext, RawFormContextData } from './useRawFormContext';
import { groupByUniqProp } from '../utils';
import { useValidators } from './useValidators';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { PrintButton } from '../list/buttons/PrintButton';
import { getValueOrFormula, isFormula } from '../../core-functions/evaluateFormula';
import { useUrlParamsRecordFields } from './useUrlParamsRecordFields';


export type RawFormProps = Parameters<typeof RawForm>[0];
export const RawForm = ({
    resource = 'cform_no_resource' as string,
    record = undefined as Record | undefined,
    children = null as null | React.ReactNode,
    disabled = false as boolean,
    refToParentListFieldName = undefined as string | undefined,
    parentResourceId = undefined as string | undefined,
    nextSiblingResourceId = undefined as string | undefined,
    enabledActions = undefined as CFormProps['enabledActions'],
    onSave = undefined as undefined | ((data: Partial<Record>, saveOk: boolean) => void | Promise<void>)
}) => {

    const recordFieldsInUrl = useUrlParamsRecordFields();

    const { url } = useRouteMatch();
    const extraActions = useMemo(() => {
        return enabledActions?.filter(act => act.actionType !== "SAVE")
    }, [enabledActions]);
    const saveAction: ActionSAVE | undefined = useMemo(() => {
        return enabledActions?.find(act => act.actionType === "SAVE") as ActionSAVE | undefined;
    }, [enabledActions]);
    const saveButtonLabel = useMemo(() => {
        if (isFormula(saveAction?.label)) { 
            const val = getValueOrFormula(record || {id: null}, saveAction?.label);
            console.log('XXX', record, saveAction?.label, val);
            return val;
        }
        return saveAction?.label;
    }, [record, saveAction])
    const redirectOnSave = useMemo(() => {
        const redirectOnSaveAct = saveAction?.extraActions?.find(act => act.actionType === "REDIRECT") as ActionREDIRECT | undefined;
        if (redirectOnSaveAct?.redirectNextSibling && nextSiblingResourceId) {
            return url.replace(/\/[^\/]+$/, `/${nextSiblingResourceId}`);
        } else if (redirectOnSaveAct?.to) {
            const to = redirectOnSaveAct?.to;
            return `/${to.resource}/${record?.[to.referenceField]}`;
        }
        
        return undefined;
    }, [saveAction, nextSiblingResourceId, record]);

    const beforeSave = useCallback((resource: string, data: Record) => {
        const setAction = saveAction?.extraActions?.find(act => act.actionType === "SET") as ActionSET | undefined;
        if (setAction) {
            data[setAction.source] = setAction.value;
        }
    }, [saveAction]);

    const deleteAction: ActionDELETE | undefined = useMemo(() => {
        return enabledActions?.find(act => act.actionType === "DELETE") as ActionDELETE | undefined;
    }, [enabledActions]);

    const { resourceWithFields, onUpsertRecord } = useUpsertRecord(resource);
    const save: FormWithRedirectProps['save'] = useCallback((data, redirectTo, optional) => {
        if (refToParentListFieldName && parentResourceId) {
            data[refToParentListFieldName] = parentResourceId;
        }
        onUpsertRecord(data, redirectOnSave, beforeSave);
        if (onSave) onSave(data, true);
    }, [refToParentListFieldName, parentResourceId, redirectOnSave, resourceWithFields, onUpsertRecord]);

    const fieldDefsByName = groupByUniqProp(resourceWithFields.field_defs, 'name');
    const validators = useValidators(resource, fieldDefsByName, record == undefined);
    const validateForm = (values) => {
        const errors = {};
        for (let [k, v] of Object.entries(values)) {
            if (validators[k]) {
                const err = validators[k](v, values, null);
                if (err) errors[k] = err;
            }
        }
        return errors;
    };

    const [inputs, setInputs] = useState<RawFormContextData['inputs']>({});
    const addInput: RawFormContextData['addInput'] = (name, props) => {
        if (!inputs[name]) {
            setInputs({
                ...inputs,
                [name]: props,
            });
        }
    }

    const formContext: RawFormContextData = {
        isCreate: record == undefined,
        resource,
        record,
        recordFieldsInUrl,
        fieldDefsByName,
        inputs,
        addInput
    };

    return (
        <RawFormContext.Provider value={formContext}>
            <FormWithRedirect
                save={save}
                record={record}
                validate={validateForm}
                render={formProps => (
                    // here starts the custom form layout
                    <form style={{ border: 0, padding: 0, margin: 0 }}>
                        <fieldset disabled={disabled} style={{ border: 0, margin: 0 }}>
                            <div style={{ margin: "20px" }} >
                                <Grid container direction="column" spacing={2} wrap="wrap" justify="space-between"
                                    style={{ padding: '10px', margin: 0 }}
                                >
                                    {/* {Children.count(children)} */}
                                    {children}
                                </Grid>
                            </div>
                            <Toolbar className="frmdb-form-actions-toolbar">
                                <div style={{ display: "flex", justifyContent: "space-between", width: "100%", borderTop: '10px', paddingTop: "20px", borderColor: "grey" }}  >
                                    <SaveButton
                                        saving={formProps.saving}
                                        handleSubmitWithRedirect={formProps.handleSubmitWithRedirect}
                                        label={saveButtonLabel}
                                    />
                                    {extraActions &&
                                        <ButtonGroup color="primary" aria-label="outlined primary button group">
                                            {extraActions.map(act => {
                                                if (act.actionType === "PRINT") {
                                                    return <PrintButton />;
                                                }
                                            })}
                                        </ButtonGroup>
                                    }
                                    {!deleteAction?.disabled && < DeleteButton
                                        resource={resource}
                                        record={formProps.record}
                                        saving={formProps.saving}
                                        mutationMode="pessimistic"
                                        redirect={false}
                                    />}
                                </div>
                            </Toolbar>
                        </fieldset>
                    </form>
                )}
            />
        </RawFormContext.Provider>
    );
};
RawForm.displayName = 'RawForm';

