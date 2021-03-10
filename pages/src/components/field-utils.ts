import { CInputProps } from "../core-domain/page";

export function getFieldLabel(resource: string, field: CInputProps) {
    return `resources.${resource}.fields.${field.source}` +
        (field.cInputType === "Reference" && field.referenceText != "id" ? `__.${field.referenceText}` : '');
}
