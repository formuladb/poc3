import React, { useState, useEffect } from 'react';
import { IS_NOT_NULL } from "../../core-functions/ScalarFunctions";

import { required, Validator } from 'react-admin';
import { RawFormContextData } from "./useRawFormContext";
import { ResourceFieldDef } from '../../core-domain/fields';
import { isFieldRequired } from '../../core-functions/validateAndConvertFields';

const requiredFn = required();

export function useValidators(resource: string, fieldDefsByName: RawFormContextData['fieldDefsByName'], isCreate: boolean): { [source: string]: Validator } {
    let ret: ReturnType<typeof useValidators> = {};
    for (let fieldDef of Object.values(fieldDefsByName)) {
        if (fieldDef.name == "id" && isCreate) continue;//skip "id" field for "create" forms
        ret[fieldDef.name] = (value, allValues, props) => {
            const isRequired = isFieldRequired(fieldDef);
            console.debug('validationFn', resource, fieldDef.name, value, fieldDef, isRequired);
            if (isRequired) return requiredFn(value, allValues);
        };
    }

    return ret;
}
