import { Element, useNode } from '@craftjs/core';
import React from 'react';
import { Grid } from '@material-ui/core';
import { ContainerDefaultProps, ContainerSettings } from './CPaper';
import { Paper, FormControl, FormLabel } from '@material-ui/core';

export function CColumn ({ 
    background="transparent", 
    padding=null as null|number|string, 
    children=null as null | React.ReactNode,
}) {
    const {
        connectors: { connect },
    } = useNode();
    return (
        <Grid container direction="column" spacing={2}
            ref={connect as (instance: HTMLDivElement | null) => void}
        >
            {children}
        </Grid>
    );
};

CColumn.craft = {
    displayName: 'Column',
    props: ContainerDefaultProps,
    related: {
        settings: ContainerSettings,
    },
    rules: {
        canMoveIn: () => true,
    },
};
