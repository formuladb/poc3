import "reflect-metadata";
import { createConnection, getManager, getRepository } from "typeorm";
import { putRows } from "../../core-orm/putRow";
import { FrmdbResource } from "@core/entity/FrmdbResource";
import { FrmdbSystemParam } from "@core/entity/FrmdbSystemParam";
import { putRole } from "src/core-orm/putRole";
import { entityMetadata } from "src/core-orm/entityMetadata";
import { FrmdbPage } from "@core/entity/FrmdbPage";

export default async () => {

    await putRows(FrmdbResource, [
        { id: entityMetadata(FrmdbResource).tableName, parent: "TBD", icon: "TBD", resource_type: "RESOURCE", menu_order: 0 },
        { id: entityMetadata(FrmdbPage).tableName, parent: "TBD", icon: "TBD", resource_type: "RESOURCE", menu_order: 0 },
        { id: "administer", icon: "material-design-icons/settings", resource_type: "GROUP", menu_order: 1 },
        { id: "operate", icon: "material-design-icons/person", resource_type: "GROUP", menu_order: 2 },
    ]);

    await putRows(FrmdbSystemParam, [
        { id: "LOCALE", val: "en" },
    ]);

    
    await putRole('administrator');
    await putRole('operator');
}
