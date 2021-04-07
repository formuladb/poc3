import { DEFAULT_COLS, ResourceFieldDef } from "../core-domain/fields";
import { FrmdbResourceWithFields } from "../core-domain/records";
import { CInputFormulaProps, CInputProps, CInputReferenceProps, CInputUrlFieldProps, PageNode } from "../core-domain/page";
import { isFieldRequired } from "../core-functions/validateAndConvertFields";

export function defaultEditPageContent(
    resourceWithFields: FrmdbResourceWithFields,
    isCreate: boolean
): PageNode {
    return {
        _id: "ROOT",
        _tag: "CPage",
        cPageType: "Edit",
        children: [
            {
                _tag: "CForm",
                _id: "Ek4N5ig9v",
                resource: resourceWithFields.id,
                children: [
                    {
                        _tag: "CRow",
                        _id: "MainRowId",
                        children: defaultEditPageFields(resourceWithFields, isCreate)
                            .map(props => ({
                                _tag: "CInput",
                                _id: "3Ub" + props.source,
                                ...props
                            }))
                    }
                ]
            }
        ]
    };
}

export function defaultEditPageFields(
    resourceWithFields: FrmdbResourceWithFields,
    isCreate: boolean,
): CInputProps[] {
    console.log("defaultEditPageFields displayedFields", resourceWithFields)
    return resourceWithFields.field_defs
        .filter(fieldDef => {
            if (DEFAULT_COLS.includes(fieldDef.name)) return false;
            if (isCreate && 'id' === fieldDef.name) return false;
            if (isCreate && fieldDef.c_is_computed) return false;
            if (isCreate && !isFieldRequired(fieldDef)) return false;
            return true;
        })
        .map(fieldDef => getCInputPropsFromFieldDef(resourceWithFields.id, fieldDef))
        ;
}

export function getCInputPropsFromFieldDef(resource: string, fieldDef: ResourceFieldDef) {
    if (fieldDef.c_reference_to) {
        const ret: CInputReferenceProps = {
            cInputType: "Reference",
            resource: resource,
            source: fieldDef.name,
            disabled: fieldDef.c_is_computed,
            reference: fieldDef.c_reference_to,
        };
        return ret;

    } else if (fieldDef.name.indexOf('url__') === 0) {
        const ret: CInputUrlFieldProps = {
            cInputType: "UrlField",
            resource: resource,
            source: fieldDef.name,
            disabled: fieldDef.c_is_computed,
        };
        return ret;
    } else {
        const ret: Exclude<CInputProps, CInputReferenceProps | CInputFormulaProps> = {
            cInputType: fieldDef.type,
            resource: resource,
            source: fieldDef.name,
            disabled: fieldDef.c_is_computed,
        };
        return ret;
    }
}

export function getDefaultReferenceText(referenceWithFields: FrmdbResourceWithFields): string {
    let nameCol: string | null = null;
    let strCol: string | null = null;

    for (let col of referenceWithFields.field_defs) {
        if (['name', 'title', 'username'].includes(col.name)) {
            nameCol = col.name;
        } else if (['code', 'description'].includes(col.name) && !nameCol) {
            nameCol = col.name;
        } else if (col.type == "TextField" && !strCol) {
            strCol = col.name;
        }
    }
    return nameCol || strCol || 'id';
}