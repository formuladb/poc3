import { CInputProps } from "../core/entity/page";

export function getFieldLabel(resource: string, field: CInputProps) {
    return `resources.${resource}.fields.${field.source}` +
        (field.cInputType === "Reference" && field.referenceText != "id" ? `__.${field.referenceText}` : '');
}
