import * as React from 'react';
import { cloneElement, useMemo } from 'react';
import {
    useListContext,
    TopToolbar,
    CreateButton,
    ExportButton,
    Button,
    sanitizeListRestProps,
    ListControllerProps, Record,
} from 'react-admin';
import { EditButtonPopoverField } from './buttons/EditButtonPopoverFieldProps';
import { CListPropsBase } from '../../core-domain/page';
import { ImportButton } from './buttons/ImportButton';
import { ListContextMemoizer } from './ListContextMemoizer';

type Props = Partial<CListPropsBase> & {
    parentResourceId?: string,
    className?,
    filters?,
    maxResults?,
};

export function ListActions(props: Props) {
    return <ListContextMemoizer>
        <ListActionsInternal {...props} />
    </ListContextMemoizer>;
}

function ListActionsInternal({
    isSubListOf,
    enabledActions,
    fields,
    refToParentListFieldName,
    parentResourceId,
    listContext,
    ...props
}: Props & { listContext?: ListControllerProps<Record> }) {
    if (!listContext) throw new Error("listContext is missing");

    const {
        className,
        filters,
        maxResults,
        ...rest
    } = props;

    const {
        currentSort,
        resource,
        displayedFilters,
        filterValues,
        hasCreate,
        basePath,
        selectedIds,
        showFilter,
        total,
    } = listContext;

    return (
        <TopToolbar className={className} {...sanitizeListRestProps(rest)}>
            {filters && cloneElement(filters, {
                resource,
                showFilter,
                displayedFilters,
                filterValues,
                context: 'button',
            })}
            {enabledActions?.map(act => {
                if (act.actionType === 'CREATE') {
                    if (!isSubListOf) {
                        return <CreateButton key="EditButtonPopoverField" basePath={basePath} />;
                    } else {
                        return <EditButtonPopoverField key="EditButtonPopoverField" isCreate={true} resource={resource}
                            record={undefined} fields={fields}
                            refToParentListFieldName={refToParentListFieldName} parentResourceId={parentResourceId}
                        />;
                    }
                } else if (act.actionType === "EXPORT") {
                    return <ExportButton key="ExportButton"
                        disabled={total === 0}
                        resource={resource}
                        sort={currentSort}
                        filterValues={filterValues}
                        maxResults={maxResults}
                    />;
                } else if (act.actionType === "IMPORTDATA") {
                    return <ImportButton key="ImportButton"
                        resource={resource}
                        refToParentListFieldName={refToParentListFieldName} parentResourceId={parentResourceId}
                        fieldMappings={act.fieldMappings}
                    />;
                }
            })}
        </TopToolbar>
    );
};
