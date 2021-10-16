import CListPropsSchema from '../../core-domain/json-schemas/CListProps.json';
import CInputPropsSchema from '../../core-domain/json-schemas/CInputProps.json';
import CElementPropsSchema from '../../core-domain/json-schemas/CElementProps.json';
import CBlockPropsSchema from '../../core-domain/json-schemas/CBlockProps.json';

type AnyOfsType = { "$ref": string }[];

function fixAnyOf(anyOfs: AnyOfsType) {
    for (let anyOf of Object.values(anyOfs)) {
        if (anyOf?.$ref?.indexOf('#/definitions/CInput') === 0) {
            const cInputType = anyOf.$ref.replace('#/definitions/CInput', '').replace(/Props$/, '');
            anyOf["title"] = cInputType;
        } else if (anyOf?.$ref?.indexOf('#/definitions/CList') === 0) {
            const cListType = anyOf.$ref.replace('#/definitions/CList', '').replace(/Props$/, '');
            anyOf["title"] = cListType;
        } else if (anyOf?.$ref?.indexOf('#/definitions/Action') === 0) {
            const actionType = anyOf.$ref.replace('#/definitions/Action', '');
            anyOf["title"] = actionType;
        }
    }
}

function fixAnyOfRecursive(obj: object) {
    for (let [k, v] of Object.entries(obj)) {
        if (k === "anyOf") fixAnyOf(v)
        else if (typeof v === "object") fixAnyOfRecursive(v);
    }
}

function postProcessSchemas(schema:
    | typeof CListPropsSchema
    | typeof CInputPropsSchema
    | typeof CElementPropsSchema
    | typeof CBlockPropsSchema
) {

    fixAnyOfRecursive(schema);

    for (let [name, def] of Object.entries(schema.definitions)) {
        if ("cListType" in def?.properties) {
            const cListType = name.replace(/^CList/, '').replace(/Props$/, '');
            def.properties.cListType.type = "string";
            def.properties.cListType["readOnly"] = true;
            def.properties.cListType["const"] = cListType;
            delete (def.properties.cListType as any).enum;
            def.properties.cListType["default"] = cListType;
        } else if ("actionType" in def?.properties) {
            const actionType = name.replace(/^Action/, '');
            def.properties.actionType.type = "string";
            def.properties.actionType["readOnly"] = true;
            def.properties.actionType["const"] = actionType;
            def.properties.actionType["default"] = actionType;
        } else if ("cInputType" in def?.properties) {
            const cInputType = name.replace(/^CInput/, '').replace(/Props$/, '');
            def.properties.cInputType.type = "string";
            (def.properties.cInputType as any).readOnly = true;
            (def.properties.cInputType as any).const = cInputType;
            (def.properties.cInputType as any).default = cInputType;
        } else if ("cElementType" in def?.properties) {
            const cElementType = name.replace(/^CElement/, '').replace(/Props$/, '');
            def.properties.cElementType.type = "string";
            (def.properties.cElementType as any).readOnly = true;
            (def.properties.cElementType as any).const = cElementType;
            (def.properties.cElementType as any).default = cElementType;
        } else if ("cBlockType" in def?.properties) {
            const cBlockType = name.replace(/^CBlock/, '').replace(/Props$/, '');
            def.properties.cBlockType.type = "string";
            (def.properties.cBlockType as any).readOnly = true;
            (def.properties.cBlockType as any).const = cBlockType;
            (def.properties.cBlockType as any).default = cBlockType;
        }
    }

    return schema;
}

export function getCInputSchema() {
    return postProcessSchemas(CInputPropsSchema);
}
export function getCListSchema() {
    return postProcessSchemas(CListPropsSchema);
}
export function getCElementSchema() {
    return postProcessSchemas(CElementPropsSchema);
}
export function getCBlockSchema() {
    return postProcessSchemas(CElementPropsSchema);
}