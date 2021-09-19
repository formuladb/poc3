import { EntityManager, getConnection, getConnectionManager, getManager } from "typeorm";
import { EventSubscriber, EntitySubscriberInterface, InsertEvent, UpdateEvent, RemoveEvent } from "typeorm";

@EventSubscriber()
export class SetTenantSubscriber implements EntitySubscriberInterface {

    async setTenant(mng: EntityManager, tenant: string) {
        console.log('HEREEEEEEE');
        await mng.query(`SELECT set_config('request.jwt.claim.tenant', '${tenant}', true);`)
        console.log('HEREEEEEEE--');
        let data;
        data = await mng.query(`SELECT current_setting('request.jwt.claim.tenant', true);`);
        console.log('HEREEEEEEE2', data);
    }

    async beforeInsert(event: InsertEvent<any>) {
        await this.setTenant(event.manager, 'pagerows');
    }
    async beforeUpdate(event: UpdateEvent<any>) {
        await this.setTenant(event.manager, 'pagerows');
    }
    async beforeRemove(event: RemoveEvent<any>) {
        await this.setTenant(event.manager, 'pagerows');
    }
}
