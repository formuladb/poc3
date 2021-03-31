import { useRef } from "react";
import { diff } from 'deep-object-diff';

export function useTraceRenders(cmpName: string, props) {
    const prev = useRef(props);
    console.log(`${cmpName} useTraceRenders`, prev.current === props ? '===' : diff(prev.current, props));
    prev.current = props;
}
