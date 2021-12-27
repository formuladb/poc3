import "reflect-metadata";
import { autoMigrate } from "src/core-orm/autoMigrate";
import { Connection } from "typeorm";
import { InventoryTransaction } from "./entity/InventoryTransaction";
import { ProductCategory } from "./entity/ProductCategory";
import { ProductType } from "./entity/ProductType";

export default async (conn: Connection) => {
    await autoMigrate(conn, ProductType);
    await autoMigrate(conn, ProductCategory);
    await autoMigrate(conn, InventoryTransaction);
}
