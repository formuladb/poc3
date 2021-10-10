import "reflect-metadata";
import { autoMigrate } from "src/core-orm/autoMigrate";
import { putRow, putRows } from "../../core-orm/putRow";
import { Customer } from "./entity/Customer";
export default async () => {
    await autoMigrate(Customer);
}
