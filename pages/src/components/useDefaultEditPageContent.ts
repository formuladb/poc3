import { DataProvider, RecordMap } from "react-admin";
import { DEFAULT_COLS } from "../core-domain/fields";
import { FrmdbResource, FrmdbResourceWithFields } from "../core-domain/records";
import { ResourceFieldDef } from "../core-domain/fields";
import { CInputNode, CInputProps, PageNode } from "../core-domain/page";
import { useMultipleResourcesWithFields, useResourceWithFields } from "./form/useResourceWithFields";
import { groupByUniqProp } from "./utils";

export async function useDefaultEditPageContent(
    resource: string,
    isCreate: boolean,
): Promise<PageNode> {
    const resourceWithFields = useResourceWithFields(resource);

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
                        children: useEditPageFields(resourceWithFields, isCreate)
                            .map(props => ({
                                _tag: "CInput",
                                _id: "3UbW" + props.source,
                                ...props
                            })),
                    }
                ]
            }
        ]
    };
}

export function useEditPageFields(
    resourceWithFields: FrmdbResourceWithFields,
    isCreate: boolean,
): CInputProps[] {

    const references = resourceWithFields.field_defs
        .filter(f => f.c_reference_to)
        .map(f => f.c_reference_to!);
    const uniqueReferences = Array.from(new Set<string>(references));
    const referencesWithFields = useMultipleResourcesWithFields(uniqueReferences);
    const referencesWithFieldsByName = groupByUniqProp(referencesWithFields, 'id');

    const fields = resourceWithFields.field_defs
        .filter(col => {
            if (DEFAULT_COLS.includes(col.name)) return false;
            if (isCreate && 'id' === col.name) return false;
            if (isCreate && col.c_is_computed) return false;
            return true;
        })
        .map((col) => ({
            cInputType: col.c_reference_to ? "Reference" : col.type,
            resource: resourceWithFields.id,
            source: col.name,
            variant: "standard",
            disabled: col.c_is_computed,
            reference: col.c_reference_to ? col.c_reference_to : undefined,
            referenceText: col.c_reference_to ?
                (useDefaultReferenceText(referencesWithFieldsByName[col.c_reference_to]))
                : undefined
            ,
            c_check: col.c_check,
            c_default: col.c_default,
            c_formula: col.c_formula,
        } as CInputProps))
        ;
    return fields;
}

async function useDefaultReferenceText(referenceWithField: FrmdbResourceWithFields): Promise<string> {
    let nameCol: string | null = null;
    let strCol: string | null = null;

    for (let col of referenceWithField.field_defs) {
        console.log(col.name);
        if (['name', 'title', 'username'].includes(col.name)) {
            nameCol = col.name;
        } else if (['code', 'description'].includes(col.name) && !nameCol) {
            nameCol = col.name;
        } else if (col.type == "TextField" && !strCol) {
            strCol = col.name;
        }
    }
    console.log(nameCol || strCol || 'id');
    return nameCol || strCol || 'id';
}