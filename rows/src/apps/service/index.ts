import "reflect-metadata";
import { autoMigrate } from "src/core-orm/autoMigrate";
import { putRow, putRows } from "../../core-orm/putRow";
import { Equipment } from "./entity/Equipment";
import { EquipmentCategory } from "./entity/EquipmentCategory";
import { EquipmentType } from "./entity/EquipmentType";

export default async () => {
    await autoMigrate(conn, EquipmentType);
    await autoMigrate(conn, EquipmentCategory);
    await autoMigrate(conn, Equipment);
}
