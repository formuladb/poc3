import { isEqual } from 'lodash';
import React, { ReactElement } from 'react';
import { useListContext, ListControllerProps, Record } from 'react-admin';

export function ListContextMemoizer(props: {
    children: ReactElement<{ listContext: ListControllerProps<Record> }>,
}) {
    const listContext = useListContext();
    const { children } = props;
    if (React.Children.count(children) !== 1) {
        throw new Error(
            '<ListContextMemoizer> only accepts a single child (like <Datagrid>)'
        );
    }

    return <ListContextMemoizerInternalMemo listContext={listContext} children={children} />;
}
ListContextMemoizer.displayName = ListContextMemoizer.name;

function ListContextMemoizerInternal(props: {
    listContext: ListControllerProps<Record>,
    children: ReactElement<{ listContext?: ListControllerProps<Record> }>,
}) {
    const { listContext, children } = props;
    return (
        React.Children.map(children, child =>
            React.isValidElement(child) ? React.cloneElement(child, { listContext })
                : <div>Invalid child</div>
        ));
}
ListContextMemoizerInternal.displayName = ListContextMemoizerInternal.name;

//@ts-ignore
const ListContextMemoizerInternalMemo = React.memo(ListContextMemoizerInternal, (a, b) => {
    if (!isEqual(a.listContext, b.listContext)) {
        return false;
    }

    for (const k in a) {
        const key = k as keyof typeof a;
        if (key !== "listContext") return a[key] === b[key];
    }

    return true;
});
