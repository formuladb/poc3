import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
import { FilterListItem, Loading, useGetList } from 'react-admin';
import { createTree, RenderTree } from './createTree';

const useStyles = makeStyles({
    root: {
        height: 110,
        flexGrow: 1,
        maxWidth: 400,
    },
    listItem: {
        padding: 0,
    }
});

export function FilterTree(props: {filterTreeResource: string, filterTreeField: string}) {
    const {filterTreeResource, filterTreeField} = props;
    const { data, ids, loading, error } = useGetList(
        filterTreeResource,
        { page: 1, perPage: 1000 },
        { field: 'id', order: 'ASC' },
        {}
    );
    let treeNodes = createTree((ids || []).map(id => id + ''));
    //console.debug(treeNodes);
    const classes = useStyles();

    if (loading) { return <Loading />; }
    if (error) { return <p>ERROR</p>; }

    return (
        <TreeView
            className={classes.root}
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpanded={['root']}
            defaultExpandIcon={<ChevronRightIcon />}
        >
            {renderTree(filterTreeField, treeNodes, classes.listItem)}
        </TreeView>
    );
}

const renderTree = (categoryColumnName: string, nodes: RenderTree[], itemStyle) => (
    <>{nodes.map(node => (
        <TreeItem key={node.id} nodeId={node.id}
            label={<FilterListItem
                label={node.name}
                value={{
                    [`${categoryColumnName}@like`]: `${node.id}*`,
                }}
            />}
        >
            {Array.isArray(node.children) ? renderTree(categoryColumnName, node.children, itemStyle) : null}
        </TreeItem>
    ))}</>
);
