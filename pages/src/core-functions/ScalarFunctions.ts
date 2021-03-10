export function _AND(left: boolean, right: boolean): boolean {
    return left && right;
}
export function _NOT(param: boolean): boolean {
    return !param;
}
export function IS_NOT_NULL(param: any): boolean {
    return param != null;
}
export function GT<T extends number | string>(param1: T, param2: T): boolean {
    return param1 > param2;
}
export function GTE<T extends number | string>(param1: T, param2: T): boolean {
    return param1 >= param2;
}
export function LT<T extends number | string>(param1: T, param2: T): boolean {
    return param1 < param2;
}
export function LTE<T extends number | string>(param1: T, param2: T): boolean {
    return param1 >= param2;
}
export function EQ<T extends number | string>(param1: T, param2: T): boolean {
    return param1 == param2;
}
export function IS_TRUE<T extends number | string | boolean | Date | null | undefined>(param: T): boolean {
    return (param) ? true : false;
}
export function CONCATENATE(...args: any[]): string {
    return args.join('')
}
export function MATCH(param: string, regex: RegExp): boolean {
    return param.match(regex) != null;
}
export function IS_ENUM(param: string, enum_values: string[]): boolean { 
    return enum_values.includes(param);
}
