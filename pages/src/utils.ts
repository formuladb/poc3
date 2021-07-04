import { groupBy, mapValues, Dictionary } from 'lodash';

export function groupByUniqProp<T>(values: T[], propName: keyof T): Dictionary<T> {
    return mapValues(groupBy(values, propName), v => v[0]);
}
