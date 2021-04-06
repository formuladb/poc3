export function _AND(left: boolean, right: boolean): boolean {
    return left && right;
}
export function _NOT(param: boolean): boolean {
    return !param;
}
export function IS_NULL(param: any): boolean {
    return param == null;
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

export function IFS(
    test1: boolean, value1: any, 
    test2 = null as boolean | null, value2 = null as any,
    test3 = null as boolean | null, value3 = null as any,
    test4 = null as boolean | null, value4 = null as any,
    test5 = null as boolean | null, value5 = null as any,
    test6 = null as boolean | null, value6 = null as any
) {
    if (test1) return value1;
    else if (test2) return value2;
    else if (test3) return value3;
    else if (test4) return value4;
    else if (test5) return value5;
    else if (test6) return value6;
}

export const ScalarFunctions = {
    _AND,
    _NOT,
    IS_NULL,
    IS_NOT_NULL,
    GT,
    GTE,
    LT,
    LTE,
    EQ,
    IS_TRUE,
    CONCATENATE,
    MATCH,
    IS_ENUM,
    IFS,
};
