import { Node as CraftJsNode, useEditor, useNode } from '@craftjs/core';
import React, { useEffect, useState } from 'react';
import { Grid } from '@material-ui/core';
import { CmpCraftStatic, isGridContainerNode } from '../utils';
import { CPageProps } from '../../core-domain/page';
import { CmpSettings } from '../editor/CmpSettings';
import { JSONSchema7 } from 'json-schema';
import CPagePropsSchema from '../../core-domain/json-schemas/CPageProps.json';

export function CPage({
    children = null as null | React.ReactNode,
    ...props
}: CPageProps & { children: null | React.ReactNode }) {
    console.log(props);
    const {
        connectors: { connect },
    } = useNode();

    return (
        <Grid container direction="column" spacing={2}
            style={{padding: '10px'}}
            ref={connect as (instance: HTMLDivElement | null) => void}
        >
            {children}
        </Grid>
    );
};


const CPageSettingSchema = CPagePropsSchema as JSONSchema7;
export const CPageSettings = () => {
    return <CmpSettings schema={CPageSettingSchema} />
};

const craft: CmpCraftStatic = {
    displayName: 'Page',
    props: {},
    related: {
        settings: CPageSettings,
    },
    rules: {
    },
};
CPage.craft = craft;
