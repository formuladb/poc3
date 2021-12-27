import { Connection, DeepPartial, getRepository, ObjectType } from "typeorm";

export async function putRow<ENTITY>(
    conn: Connection,
    entity: ObjectType<ENTITY>,
    attrs: { [k in keyof ENTITY]: ENTITY[k] },
    noSave?: "NO-SAVE"
): Promise<ENTITY> {
    const repo = conn.getRepository(entity);
    const row = repo.create(attrs as DeepPartial<ENTITY>);
    
    if (!noSave) await repo.save(row);

    return row;
}

export async function putRows<ENTITY>(
    conn: Connection,

    entity: ObjectType<ENTITY>,
    attrs: { [k in keyof ENTITY]: ENTITY[k] }[]
): Promise<void> {
    for (let attr of attrs) {
        await putRow(conn, entity, attr);
    }
}
