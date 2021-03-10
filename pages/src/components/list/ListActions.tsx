import * as React from 'react';
import { cloneElement, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
    useListContext,
    TopToolbar,
    CreateButton,
    ExportButton,
    Button,
    sanitizeListRestProps,
} from 'react-admin';
import IconEvent from '@material-ui/icons/Event';
import { EditButtonPopoverField } from './buttons/EditButtonPopoverFieldProps';
import { CListProps } from '../../core-domain/page';
import { ImportButton } from './buttons/ImportButton';

export function ListActions({
    isSubListOf,
    enabledActions,
    fields,
    refToParentListFieldName,
    parentResourceId,
    ...props
}: Partial<CListProps> & {
    parentResourceId?: string,
    className?,
    filters?,
    maxResults?,
}) {
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
    } = useListContext();
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
                        return <CreateButton basePath={basePath} />;
                    } else {
                        return <EditButtonPopoverField isCreate={true} resource={resource}
                            record={undefined} fields={fields}
                            refToParentListFieldName={refToParentListFieldName} parentResourceId={parentResourceId}
                        />;
                    }
                } else if (act.actionType === "EXPORT") {
                    return <ExportButton
                        disabled={total === 0}
                        resource={resource}
                        sort={currentSort}
                        filterValues={filterValues}
                        maxResults={maxResults}
                    />;
                } else if (act.actionType === "IMPORTDATA") {
                    return <ImportButton
                        resource={resource}
                        refToParentListFieldName={refToParentListFieldName} parentResourceId={parentResourceId}
                        fieldMappings={act.fieldMappings}
                    />;
                }
            })}
        </TopToolbar>
    );
};
