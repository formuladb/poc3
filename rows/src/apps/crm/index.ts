import "reflect-metadata";
import { autoMigrate } from "src/core-orm/autoMigrate";
import { Connection } from "typeorm";
import { putRow, putRows } from "../../core-orm/putRow";
import { Customer } from "./entity/Customer";
export default async (conn: Connection) => {
    await autoMigrate(conn, Customer);
}
