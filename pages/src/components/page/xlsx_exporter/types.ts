import { Buffer } from 'exceljs';
import { Record, Translate } from 'react-admin';
import { ResourceFieldDef } from '../../../core/entity/fields';

export interface FrmdbExcelExportWorkerInput {
    type: "input";
    resource: string;
    resourceName: string;
    columns: ResourceFieldDef[];
    columnNames: {[colName: string]: string};
    records: Record[];
}
export interface FrmdbExcelExportWorkerStatus {
    type: "status";
    msg: string;
}
export interface FrmdbExcelExportWorkerReturn {
    type: "return";
    buffer: Buffer;
}
export type FrmdbExcelExportWorkerMessages = 
    | FrmdbExcelExportWorkerInput
    | FrmdbExcelExportWorkerStatus
    | FrmdbExcelExportWorkerReturn
;
