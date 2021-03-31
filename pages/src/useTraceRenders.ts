import { useRef } from "react";
import { diff } from 'deep-object-diff';
interface ObjectDict {
    [index: string]: any;
}

export function useTraceRenders(cmpName: string, props) {
    const prev = useRef(props);
    const changedProps = Object.entries(props).reduce(
        (lookup: ObjectDict, [key, value]) => {
            if (prev.current[key] !== value) {
                lookup[key] = [prev.current[key], value];
            }
            return lookup;
        },
        {}
    );
    console.log(`${cmpName} useTraceRenders`, prev.current === props ? '===' : changedProps);
    prev.current = props;
}
