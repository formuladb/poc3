import "reflect-metadata";
import { autoMigrate } from "src/core-orm/autoMigrate";
import { InventoryTransaction } from "./entity/InventoryTransaction";
import { ProductCategory } from "./entity/ProductCategory";
import { ProductType } from "./entity/ProductType";

export default async () => {
    await autoMigrate(ProductType);
    await autoMigrate(ProductCategory);
    await autoMigrate(InventoryTransaction);
}
