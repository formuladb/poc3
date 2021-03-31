import { useRef, useEffect } from "react";
import { ListControllerProps, useListContext, Record } from "react-admin";
import { isEqual } from 'lodash';
import { diff } from 'deep-object-diff';

export function useMemoizedHookDeepEq(hook: Function, ...args) {
    return useMemoizedHookDeepEqDiff(false, hook, ...args);
}

export function useMemoizedHookDeepEqDiff(diff: boolean, hook: Function, ...args) {
    const hookResult = hook(...args);
    const prev: React.MutableRefObject<any> = useRef(hookResult);

    const hasNotChanged = isEqual(prev.current, hookResult);
    if (hasNotChanged) {
        return prev.current;
    } else {
        if (diff) {
            console.log('useMemoizedHookDeepEqDiff-useTraceRenders', 
                prev.current === hookResult, 'hasNotChanged=', hasNotChanged,
                diff(prev.current, hookResult), prev, hookResult);
        }
        prev.current = hookResult;
        return hookResult;
    }
}
