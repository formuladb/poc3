import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
    Filter,
    List,
    TextInput,
    FilterList,
    ListProps,
    useTranslate,
    useListContext,
    useDataProvider,
} from 'react-admin';
import { Card, CardContent } from '@material-ui/core';
import { makeStyles, Snackbar } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import CategoryIcon from '@material-ui/icons/AccountTree';
import FdbPagination from '../list/FdbPagination';
import { FilterTree } from '../list/FilterTree';
import { ListActions } from '../list/ListActions';
import { ROOT_NODE, useEditor } from '@craftjs/core';
import { CPageListProps } from '../../core-domain/page';
import { xslx_exporter } from './xlsx_exporter/xlsx_exporter';
import { ResourceFieldDef } from '../../core-domain/fields';
import { FInput } from '../form/FInput';
import { FrmdbResourceWithFields } from '../../core-domain/records';

function PageFilter(props: object) {
    const { resource } = useListContext();;
    const [columns, setColumns] = useState([] as ResourceFieldDef[])
    const dataProvider = useDataProvider();
    useEffect(() => {
        (async () => {
            let resourceCols = [] as ResourceFieldDef[];
            if (resource) {
                let res = await dataProvider.getOne<FrmdbResourceWithFields>(
                    "frmdb_resource_with_fields", { id: resource });
                if (res && res.data) {
                    let refWithFields = res.data;
                    setColumns(refWithFields.field_defs);
                } else {
                    console.warn(`cannot get columns for ${resource}`);
                }
            }
        })();
    }, [resource]);

    return <Filter {...props}>
        {columns.map(col => {
            return <FInput
                key={col.name}
                type={col.type}
                label={`resources.${resource}.fields.${col.name}`}
                source={`${col.name}@ilike`}
            />
        })}
    </Filter>
};

const FilterSidebar = ({ filterTreeResource, filterTreeField }) => (
    <div style={{margin: "10px"}}>
        <Card style={{ overflow: 'auto', height: "75vh", width: "220px" }}>
            <CardContent>
                <FilterList label="i18nt.category" icon={<CategoryIcon />}>
                    <FilterTree filterTreeResource={filterTreeResource} filterTreeField={filterTreeField} />
                </FilterList>
            </CardContent>
        </Card>
    </div>
);

const useStyles = makeStyles({
    root: {
        '& .MuiToolbar-root': {
            maxWidth: "65vw !important",
        }
    },
    content: {
        flexDirection: 'row-reverse',
    },
    imgContainer: {
        '& img': {
            height: 60,
            width: 60,
            objectFit: "contain",
            transition: 'all .2s ease-in-out',
            "&:hover": {
                transform: 'scale(4)',
            }
        }
    },
    rowCell: {
        whiteSpace: "nowrap",
    }
});

const MyTextField = ({ source, trace, record = {} }: { source: any, trace: boolean, record: any }) => {
    if (trace) {
        console.log("RENDER MyTextField", source, record);
    }
    return <span>{record[source]}</span>
};

MyTextField.propTypes = {
    label: PropTypes.string,
    record: PropTypes.object,
    source: PropTypes.string.isRequired,
    trace: PropTypes.bool,
};

type ListPageProps = ListProps & {
    children: React.ReactElement,
};

export function ListPage({
    children,
    ...props
}: ListPageProps) {
    const translate = useTranslate();
    const classes = useStyles(props);

    const { pageNodeProps } = useEditor(
        (state) => ({
            enabled: state.options.enabled,
            pageNodeProps: state.nodes[ROOT_NODE]?.data?.props as CPageListProps | undefined,
        })
    );

    const [filterTreeResource, set_filterTreeResource] = useState(undefined as undefined | string);
    const [filterTreeField, set_filterTreeField] = useState(undefined as undefined | string);

    useEffect(() => {
        if (pageNodeProps) {
            set_filterTreeResource(pageNodeProps.filterTreeResource);
            set_filterTreeField(pageNodeProps.filterTreeField);
        }
    }, [pageNodeProps]);

    const [info, setInfo] = useState(undefined as string | undefined);
    const exporter = xslx_exporter(translate, (msg: string) => setInfo(msg));

    return (<>
        <List
            filters={pageNodeProps?.noFilters ? undefined : <PageFilter />}
            sort={{ field: 'id', order: 'DESC' }}
            aside={filterTreeResource ? <FilterSidebar filterTreeResource={filterTreeResource} filterTreeField={filterTreeField} /> : undefined}
            actions={<ListActions enabledActions={pageNodeProps?.enabledActions} {...props} maxResults={50000} />}
            classes={{ root: classes.root, main: classes.content }}
            pagination={pageNodeProps?.noPagination ? false : <FdbPagination largePages={pageNodeProps?.largePages} />}
            perPage={pageNodeProps?.largePages ? 200 : 10}
            exporter={exporter}
            {...props}
        >
            {children}
        </List>
        {
            info && <Snackbar open={info != undefined} autoHideDuration={2500} onClose={() => setInfo(undefined)}>
                <Alert severity="info">{info}</Alert>
            </Snackbar>
        }
    </>)
};

ListPage.craft = {
    displayName: 'ListPage',
};
