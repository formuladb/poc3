import { useRef, useEffect } from "react";

export function useTraceRenders(cmpName: string, props) {
    const prev = useRef(props);
    useEffect(() => {
        const changedProps = Object.entries(props).reduce((ps, [k, v]) => {
            if (prev.current[k] !== v) {
                ps[k] = {prev: prev.current[k], now: v};
            }
            return ps;
        }, {});
        if (Object.keys(changedProps).length > 0) {
            console.log(`${cmpName} useTraceRenders`, changedProps);
        }
        prev.current = props;
    });
}
