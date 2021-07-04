import { Record } from "react-admin";
import { ActionIMPORTDATA } from "../../core-domain/page";
import { FrmdbResourceWithFields } from "../../core-domain/records";
import { FrmdbDataProvider } from "../../ra-data-postgrest";
import { validateAndCovertObjPropertyType } from "../validateAndConvertFields";

export async function IMPORTDATA(
    dataProvider: FrmdbDataProvider,
    resourceWithFields: FrmdbResourceWithFields,
    fieldMappings: ActionIMPORTDATA['fieldMappings'],
    inputData: string[][],
    refToParentListFieldName?: string,
    parentResourceId?: string | number,
) {

    if (inputData.length <= 1) return;
    const headerRow = inputData[0];
    const colName2index: {[colName: string]: number} = {};
    headerRow.forEach((colName, idx) => {
        colName2index[colName] = idx;
    });

    const records: Record[] = [];
    for (let i = 1; i < inputData.length; i++) {
        const row = inputData[i];
        const rec: Record = {} as Record;//no id, either it is imported or computed
        for (let colMapping of fieldMappings) {
            rec[colMapping.field] = row[colName2index[colMapping.importedField]];
        }
        if (refToParentListFieldName && parentResourceId) {
            rec[refToParentListFieldName] = parentResourceId;
        }
        validateAndCovertObjPropertyType(rec, resourceWithFields);
        records.push(rec);
    }

    //ra-data-postgrest support bulk create with upsert functionality
    return dataProvider.createMany(resourceWithFields.id, {
        data: records
    });
}
