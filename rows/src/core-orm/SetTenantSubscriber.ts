import { EntityManager, getConnection, getConnectionManager, getManager } from "typeorm";
import { EventSubscriber, EntitySubscriberInterface, InsertEvent, UpdateEvent, RemoveEvent } from "typeorm";

@EventSubscriber()
export class SetTenantSubscriber implements EntitySubscriberInterface {

    async setTenant(mng: EntityManager, tenant_schema: string) {
        // await mng.query(`SELECT set_config('request.jwt.claim.tenant', '${tenant}', true);`)
        await mng.query(`SET search_path TO ${tenant_schema};`)
    }

    async beforeInsert(event: InsertEvent<any>) {
        await this.setTenant(event.manager, 't1');
    }
    async beforeUpdate(event: UpdateEvent<any>) {
        await this.setTenant(event.manager, 't1');
    }
    async beforeRemove(event: RemoveEvent<any>) {
        await this.setTenant(event.manager, 't1');
    }
}
