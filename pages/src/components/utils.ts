import { Node as CraftJsNode } from '@craftjs/core';
import { groupBy, mapValues } from 'lodash';

export type CmpCraftStatic = {
    displayName: string,
    props: object,
    related: {
        settings: object,
    },
    rules: Partial<CraftJsNode['rules']>,
};

export function isGridContainerNode(nodeName: string): boolean {
    return ['CForm', 'CRow'].includes(nodeName);
}

export function omitProps<T extends object>(obj: T, props: Array<keyof T>) {
    let ret = {...obj};
    for (let propName of props) {
        delete ret[propName];
    }
    return ret;
}

export function groupByUniqProp<T>(values: T[], propName: keyof T) {
    return mapValues(groupBy(values, propName), v => v[0]);
}
