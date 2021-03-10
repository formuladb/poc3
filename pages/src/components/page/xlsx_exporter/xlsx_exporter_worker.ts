/**
 * © 2018 S.C. FORMULA DATABASE S.R.L.
 * License TBD
 */
import * as Excel from 'exceljs';
import { FrmdbExcelExportWorkerMessages,FrmdbExcelExportWorkerInput } from './types';

declare function postMessage(msg: FrmdbExcelExportWorkerMessages);

onmessage = function (ev: { data: FrmdbExcelExportWorkerInput }) {
    console.log('Message received in frmdb-excel-export.worker', ev);
    exportExcel(ev.data);
}

async function exportExcel(input: FrmdbExcelExportWorkerInput){


    postMessage({type: "status", msg: "Generating Excel"});

    let workbook = createExcelReport(input);
    let buffer: Excel.Buffer = await workbook.xlsx.writeBuffer();
    
    postMessage({type: "status", msg: "Excel created"});

    postMessage({type: "return", buffer});
}

function createExcelReport(input: FrmdbExcelExportWorkerInput): Excel.Workbook {

    var workbook = new Excel.Workbook();
    var worksheet = workbook.addWorksheet(input.resourceName);

    worksheet.columns = input.columns.map(c => ({
        header: input.columnNames[c.name],
        key: c.name
    })) as Excel.Column[];
    var headerRow = worksheet.getRow(1);
    headerRow.eachCell(function (cell, colNumber) {
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '004F81BD' }
        }
        cell.font = {
            color: { argb: '00FFFFFF' },
        }
    });

    let idx = 2;
    for (let row of input.records) {
        worksheet.addRow(row, 'n');

        let xlsRow = worksheet.getRow(idx);
        let fillColor = idx % 2 ? '00DCE6F1' : '00B8CCE4';
        xlsRow.eachCell(function (cell, colNumber) {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: fillColor }
            };
        });
        idx++;

        if (idx % 5000 == 0) {
            postMessage({type: "status", msg: `Exported ${idx} rows`});
        }
    }

    postMessage({type: "status", msg: `Rows  ${idx} done, writing xlsx file, this may take a few minutes depending on the number of records...`});

    return workbook;
}
