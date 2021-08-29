import { DeepPartial, getRepository, ObjectType } from "typeorm";

export async function putRow<ENTITY>(
    entity: ObjectType<ENTITY>,
    attrs: { [k in keyof ENTITY]: ENTITY[k] },
    noSave?: boolean
): Promise<ENTITY> {
    const repo = getRepository(entity);
    const row = repo.create(attrs as DeepPartial<ENTITY>);
    
    if (!noSave) await repo.save(row);

    return row;
}
