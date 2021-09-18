import "reflect-metadata";
import { createConnection, getManager, getRepository } from "typeorm";
import { putRows } from "../../core-orm/putRow";
import { FrmdbResource } from "@core/entity/FrmdbResource";
import { FrmdbSystemParam } from "@core/entity/FrmdbSystemParam";

export default () => {
    createConnection().then(async connection => {

        await putRows(FrmdbResource, [
            { id: "frmdb_resources", parent: "TBD", icon: "TBD", resource_type: "RESOURCE", menu_order: 0 },
            { id: "frmdb_pages", parent: "TBD", icon: "TBD", resource_type: "RESOURCE", menu_order: 0 },
            { id: "administer", icon: "material-design-icons/settings", resource_type: "GROUP", menu_order: 1 },
            { id: "operate", icon: "material-design-icons/person", resource_type: "GROUP", menu_order: 2 },
        ]);

        await putRows(FrmdbSystemParam, [
            { id: "LOCALE", val: "en" },
        ]);

    }).catch(error => console.log(error));
}