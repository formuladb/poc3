import { JSONSchema7 } from 'json-schema';
import { Element, useEditor, useNode, Node as CraftJsNode } from '@craftjs/core';
import React from 'react';
import { Grid, Box } from '@material-ui/core';
import { CmpCraftStatic } from '../utils';

import { isGridContainerNode } from '../utils';
import { CLayoutProps } from '../../core/entity/page';
import { CForm } from '../form/CForm';
import { CPage } from './CPage';
import { CmpSettings } from '../editor/CmpSettings';
import { getCLayoutSchema } from '../form/post-processed-schemas';

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


const CLayoutSettingSchema = getCLayoutSchema() as JSONSchema7;
const uiSchema = {
    "ui:title": " ",
    "ui:order": ["*", "box"],
}
export const CLayoutSettings = () => {
    return <CmpSettings uiSchema={uiSchema} schema={CLayoutSettingSchema} />
};
const CLayoutDefaultProps: CLayoutProps = {
    direction: "row",
    spacing: 1,
};
const craft: CmpCraftStatic = {
    displayName: 'Block',
    props: CLayoutDefaultProps,
    related: {
        settings: CLayoutSettings,
    },
    rules: {
        canDrop(dropTarget, self, helpers): boolean {
            let parents = [dropTarget.data.type];
            for (let ancestorId of helpers(dropTarget.id).ancestors()) {
                parents.push(helpers(ancestorId).get().data.type);
            }
            console.log('CLayout.canDrop', parents);
            for (let parent of parents) {
                console.log('CLayout.canDrop', parent, parent === CForm || parent === CLayout || parent === CPage);
                if (parent === CForm || parent === CLayout || parent === CPage) return true;
            }
            return false;
        }
    },
};
CLayout.craft = craft;
