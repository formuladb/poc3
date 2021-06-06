import { JSONSchema7 } from 'json-schema';
import { Element, useEditor, useNode, Node as CraftJsNode } from '@craftjs/core';
import React from 'react';
import { Grid } from '@material-ui/core';
import { ContainerDefaultProps, ContainerSettings } from './CPaper';
import { Paper, FormControl, FormLabel } from '@material-ui/core';
import { CColumn } from './CColumn';
import { CInput } from '../form/CInput';
import { CText } from './CText';
import { CButton } from './CButton';
import { isGridContainerNode } from '../utils';
import { CList } from '../list/CList';

export function CRow({
    background = "transparent",
    padding = null as null | number | string,
    children = null as null | React.ReactNode,
}) {
    const { query } = useEditor();
    const {
        connectors: { connect },
        node
    } = useNode(node => ({ node }));

    const extraProps: any = {};
    if (node.data.parent) {
        let parentNode = query.node(node.data.parent);
        if (isGridContainerNode(parentNode.get().data.name)) extraProps.item = true;
    }

    return (
        <Grid container direction="row" spacing={2}
            {...extraProps}
            ref={connect as (instance: HTMLDivElement | null) => void}
        >
            {children}
        </Grid>
    );
};

CRow.craft = {
    displayName: 'Row',
    props: ContainerDefaultProps,
    related: {
        settings: ContainerSettings,
    },
    rules: {
        canMoveIn: (incomingNode) => {
            console.log(incomingNode.data.type, incomingNode);
            return [CColumn, CInput, CList, CText, CButton].includes(incomingNode.data.type);
        }
    },
};
