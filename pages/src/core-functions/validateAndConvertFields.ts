import { Record } from "react-admin";
import { ResourceFieldDef } from "../core-domain/fields";
import { FrmdbResourceWithFields } from "../core-domain/records";
import { IS_NOT_NULL } from "./ScalarFunctions";

export interface FieldValidationError {
    resource: string;
    field: string;
    error: string;
}

export function validateAndCovertObjPropertyType(
    record: Record,
    resourceWithFields: FrmdbResourceWithFields
): FieldValidationError[] {

    for (let fieldDef of resourceWithFields.field_defs) {
        const fieldValue = record[fieldDef.name];
        const errStub = {
            resource: resourceWithFields.id,
            field: fieldDef.name,
        }
        switch (fieldDef.type) {
            case "NumberField":
                if ((fieldValue + '').match(/^-?\d+(\.\d+)?$/) == null) {
                    return [{ ...errStub, error: `is not a number` }];
                } else if (isFieldRequired(fieldDef) === true && fieldValue == '') {
                    return [{ ...errStub, error: `is required` }];
                } else if (typeof fieldValue === "string") {
                    record[fieldDef.name] = parseFloat(fieldValue);
                }

                break;
            case "DateField": //TODO
            case "DateTimeField": //TODO
            case "BooleanField": //TODO
                break;
        }
    }
    return [];
}

export function isFieldRequired(fieldDef: ResourceFieldDef | undefined) {
    return fieldDef &&
        (fieldDef.c_check || '').toLowerCase().indexOf(IS_NOT_NULL.name.toLowerCase()) >= 0;
}
