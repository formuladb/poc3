import { Connection, EntityMetadata, ObjectType } from "typeorm";

export function entityMetadata<ENTITY>(
    conn: Connection,
    entity: ObjectType<ENTITY>
): EntityMetadata {
    return conn.getMetadata(entity);
}
