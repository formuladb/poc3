import { Connection, ObjectType } from "typeorm";

export async function upsertChildren<ENTITY>(
    conn: Connection,
    entityClass: ObjectType<ENTITY>,
    entity: ENTITY
): Promise<void> {

    console.log("upsertChildren", entity);
    const m = conn.getMetadata(entityClass);

    for (let colM of m.columns) {
        if (colM.isArray) {
            const childRepo = conn.getRepository(
                colM.relationMetadata.entityMetadata.target
            );
            await Promise.all(entity[colM.propertyName].map(async (child) => {

                // New element will be added later
                if (!child.id) {
                    return child;
                }

                //element to be updated
                return childRepo.findOneOrFail(child.id, {
                    relations: ['parent']
                }).then(entity => {
                    // (3) filtering out primary key attribute (to avoid datatype mismatch)
                    const data = Object.keys(child)
                        .filter(key => key != 'id')
                        .reduce((obj, key) => {
                            return {
                                ...obj,
                                [key]: (<any>child)[key]
                            };
                        }, {});
                    Object.assign(entity, data);
                    // Here update for Child: @ManyToOne
                    return childRepo.save(entity).then(entity => {
                        return childRepo.findOneOrFail((entity as any).id);
                    })
                })
            }))
        }
    }
}
