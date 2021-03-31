import { useRef, useEffect } from "react";
import { IsEqualCustomizer, isEqualWith } from 'lodash';
import { diff } from 'deep-object-diff';

interface Opts {
    doDiff?: boolean;
    comparatorCustomizer?: IsEqualCustomizer;
}
export function useMemoizedHookDeepEq(opts: Opts, hook: Function, ...args) {
    const hookResult = hook(...args);
    const prev: React.MutableRefObject<any> = useRef(hookResult);

    const hasNotChanged = isEqualWith(prev.current, hookResult, opts.comparatorCustomizer);
    if (hasNotChanged) {
        return prev.current;
    } else {
        // if (opts.doDiff) {
        //     console.log('useMemoizedHookDeepEqDiff-useTraceRenders', 
        //         prev.current === hookResult, 'hasNotChanged=', hasNotChanged,
        //         'diff=', diff(prev.current, hookResult), 
        //         'prev=', prev.current, 'new=', hookResult);
        // }
        prev.current = hookResult;
        return hookResult;
    }
}
