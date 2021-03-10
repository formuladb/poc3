const NumberFilterTEnum = {'equals': 1 , 'notEqual': 1 , 'greaterThan': 1 , 'greaterThanOrEqual': 1 , 'lessThan': 1 , 'lessThanOrEqual': 1 , 'inRange': 1 };
const TextFilterTEnum = { 'equals': 1 , 'notEqual': 1 , 'contains': 1 , 'notContains': 1 , 'startsWith': 1 , 'endsWith': 1, 'match': 1, 'notMatch': 1, 'matchI': 1, 'notMatchI': 1 };
const DateFilterTEnum = { 'equals': 1 , 'notEqual': 1 , 'greaterThan': 1 , 'greaterThanOrEqual': 1 , 'lessThan': 1 , 'inRange': 1 };

type NumberFilterT = keyof typeof NumberFilterTEnum;
type TextFilterT = keyof typeof TextFilterTEnum;
type DateFilterT = keyof typeof DateFilterTEnum;

interface FilterItem {
    filterType: 'text' | 'number' | 'date';
    type: NumberFilterT | TextFilterT;
    filter: string;
    filterTo?: string;
    dateFrom?: string;//"2020-10-01 00:00:00"
    dateTo?: string//"2020-10-31 00:00:00"
}
export interface SimpleAddHocQueryFilterItem extends FilterItem {
    operator?: 'AND' | 'OR';
    condition1?: FilterItem;
    condition2?: FilterItem;
}

export interface FilterModel {
    [x: string]: SimpleAddHocQueryFilterItem;
}

export const FILTER_REGEX = new RegExp(`^filter\\.(\\w+)\\.(${Object.keys(NumberFilterTEnum).concat(Object.keys(TextFilterTEnum)).join('|')})=(\\w+)`);
export function filterItemFromQueryParam(queryParam: string): FilterItem | undefined {
    let m = queryParam.match(FILTER_REGEX);
    if (m) {
        
    } else return undefined;
}
export function makeSimpleAddHocQueryFilterItem_filterType(param: string): SimpleAddHocQueryFilterItem['filterType'] {
    if (param === "text" || param === "number") return param;
    else {console.warn(`${param} is not text OR number`); return "text"; }
}
export function makeSimpleAddHocQueryFilterItem_type(param: string, filterType: SimpleAddHocQueryFilterItem['filterType']): SimpleAddHocQueryFilterItem['type'] {
    if (filterType === "text" || TextFilterTEnum[param]) return param as TextFilterT;
    else if (filterType === "number" || NumberFilterTEnum[param]) return param as NumberFilterT;
    else {console.warn(`${param} is not text OR number`); return "contains"; }
}


export interface ValidationState {
    error?: string;
}
export type AggFunc = 'sum' | 'count' | 'avg' | 'min' | 'max' | 'first' | 'last';

export interface ColumnParams {
    field: string;
    aggFunc: AggFunc;
}

export interface SimpleAddHocQuery {
    startRow: number;
    endRow: number;
    rowGroupCols: {
        field: string;
    }[];
    valueCols: ColumnParams[];
    pivotCols: ColumnParams[];
    pivotMode: boolean;
    groupKeys: string[];
    filterModel: {
        [x: string]: SimpleAddHocQueryFilterItem;
    };
    sortModel: {colId: string, sort: 'asc' | 'desc'}[];
}

export const DEFAULT_SIMPLE_ADD_HOC_QUERY: SimpleAddHocQuery = {
    startRow: 0,
    endRow: 100,
    rowGroupCols: [],
    valueCols: [],
    pivotCols: [],
    pivotMode: false,
    groupKeys: [],
    filterModel: {},
    sortModel: [],
};