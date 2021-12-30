import { PrwTenant } from "@core/entity/PrwTenant";
import { autoMigrate } from "src/core-orm/autoMigrate";
import { Connection } from "typeorm";

export default async (conn: Connection) => {
    console.log("################################################");
    console.log("## prw ");
    console.log("################################################");

    await autoMigrate(conn, PrwTenant);
}
