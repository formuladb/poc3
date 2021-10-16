import { JSONSchema7 } from 'json-schema';
import { Element, useEditor, useNode, Node as CraftJsNode } from '@craftjs/core';
import React from 'react';
import { Grid, Box } from '@material-ui/core';

import { ContainerDefaultProps, ContainerSettings } from './CPaper';
import { CColumn } from './CColumn';
import { CInput } from '../form/CInput';
import { CElement } from './CElement';
import { CButton } from './CButton';
import { isGridContainerNode } from '../utils';
import { CLayoutProps } from '../../core/entity/page';
import { CList } from '../list/CList';

export function CLayout(nP: CLayoutProps & { children: null | React.ReactNode }) {

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
        <Box {...nP.box?.borders} {...nP.box?.spacing}>
            <Grid container direction={nP.direction || "row"} spacing={nP.spacing || 2}
                {...extraProps}
                ref={connect as (instance: HTMLDivElement | null) => void}
            >
                {nP.children}
            </Grid>
        </Box>
    );
};

CLayout.craft = {
    displayName: 'Layout',
    props: ContainerDefaultProps,
    related: {
        settings: ContainerSettings,
    },
    rules: {
        canMoveIn: (incomingNode) => {
            console.log(incomingNode.data.type, incomingNode);
            return [CColumn, CInput, CList, CElement, CButton].includes(incomingNode.data.type);
        }
    },
};
