import { Record, Translate, useNotify, Exporter } from "react-admin";

import { frmdb_sp_table_columns } from "../../../custom-api/frmdb_sp_table_columns";
import { FrmdbExcelExportWorkerInput, FrmdbExcelExportWorkerMessages } from "./types";

export function xslx_exporter(
    translate: Translate,
    info: (msg: string) => void,
) {
    const exporter: Exporter = async (
        data: Record[],
        fetchRelatedRecords,
        dataProvider,
        resource: string | undefined,
    ) => {
        console.log("Excel starting", resource, data.length, new Date());
        info(translate("Excel export starting"));

        //@ts-ignore
        let Worker = await import('worker-loader!./xlsx_exporter_worker');// eslint-disable-line import/no-webpack-loader-syntax
        //console.debug(Worker);
        const worker = new Worker.default();

        let columns = await frmdb_sp_table_columns(resource!);
        let columnNames = {};
        for (let col of columns) {
            columnNames[col.name] = translate(`resources.${resource}.fields.${col.name}`);
        }
        const resourceName = translate(`resources.${resource}.name`);

        const workerInput: FrmdbExcelExportWorkerInput = {
            type: "input", resource: resource!, resourceName, records: data, columns, columnNames
        };
        worker.postMessage(workerInput);

        worker.onmessage = (ev: { data: FrmdbExcelExportWorkerMessages }) => {
            if (ev.data.type === "status") {
                info(translate(ev.data.msg));
            } else if (ev.data.type === "return") {
                info(translate("Excel created, downloading file..."));
                var blob = new Blob([ev.data.buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                let fileName = resourceName;

                if ((window as any).navigator.msSaveOrOpenBlob) {
                    //@ts-ignore
                    window.navigator.msSaveBlob(blob, fileName);
                }
                else {
                    var elem = window.document.createElement('a');
                    elem.href = window.URL.createObjectURL(blob);
                    elem.download = fileName;
                    document.body.appendChild(elem);
                    elem.click();
                    document.body.removeChild(elem);
                    window.URL.revokeObjectURL(elem.href);
                }

                worker.terminate();
                console.log("Excel download done", resource, new Date());
            }
        };
    };

    return exporter;
}
