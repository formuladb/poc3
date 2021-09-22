import { FrmdbResource } from "@core/entity/FrmdbResource";
import { autoMigrate } from "src/core-orm/autoMigrate";
import { entityMetadata } from "src/core-orm/entityMetadata";
import { putRows } from "src/core-orm/putRow";
import { Form11_10_181 } from "./entity/Form11_10_181";

export default async () => {
    await autoMigrate(Form11_10_181);

    await putRows(FrmdbResource, [
        { id: "onrc", icon: "material-design-icons/settings", resource_type: "GROUP", menu_order: 1 },
        { id: entityMetadata(Form11_10_181).tableName, parent: "onrc", icon: "TBD", resource_type: "RESOURCE", menu_order: 0 },
    ]);

}
