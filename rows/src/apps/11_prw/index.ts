import { PrwRole } from "@core/entity/PrwRole";
import { PrwTenant } from "@core/entity/PrwTenant";
import { PrwUser } from "@core/entity/PrwUser";
import { autoMigrate } from "src/core-orm/autoMigrate";
import { Connection } from "typeorm";

export default async (conn: Connection) => {
    console.log("################################################");
    console.log("## prw ");
    console.log("################################################");

    await autoMigrate(conn, PrwTenant);

    const prw_tenants = conn.getRepository(PrwTenant);
    const prwTenant = prw_tenants.create({
        id: "prw",
        domainName: "demo",
    });
    await prw_tenants.save(prwTenant);

    const prw_users = conn.getRepository(PrwUser);
    const prw_roles = conn.getRepository(PrwRole);
    const adminRole = await prw_roles.findOne("administrator");
    await prw_users.save(prw_users.create({
        id: 101,
        prwRole: adminRole,
        username: "prw",
        pass: "prw",
    }));
}
