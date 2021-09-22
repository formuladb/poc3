import { EntityMetadata, getConnection, ObjectType } from "typeorm";

export function entityMetadata<ENTITY>(
    entity: ObjectType<ENTITY>
): EntityMetadata {
    
    const conn = getConnection();
    return conn.getMetadata(entity);
}
