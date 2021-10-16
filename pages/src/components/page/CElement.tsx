import { Grid, Box, Button, Typography } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { Node as CraftJsNode, useNode, useEditor } from '@craftjs/core';
import { CElementProps } from '../../core/entity/page';
import CElementPropsSchema from '../../core-domain/json-schemas/CElementProps.json';
import { JSONSchema7 } from 'json-schema';
import { CmpSettings } from '../editor/CmpSettings';
import { AppIcon } from '../generic/AppIcon';
import { getCElementSchema } from '../form/post-processed-schemas';
import { CmpCraftStatic } from '../utils';
import { CForm } from '../form/CForm';
import { CLayout } from './CLayout';

export const CElement = (nP: CElementProps) => {
  const { query } = useEditor();
  const {
    node,
    connectors: { connect },
  } = useNode((node) => ({ node }));


  return <Grid item md={nP?.item?.width || 3} className="" ref={connect as (instance: HTMLDivElement | null) => void}>
    <Box {...nP.box?.borders} {...nP.box?.spacing}>
      {nP.cElementType == 'Text' &&
        <Typography {...nP.typography} dangerouslySetInnerHTML={{__html: nP.content}}></Typography>}
      {nP.cElementType == 'Action' &&
        <Button size={nP.size} variant={nP.variant} color={nP.color} href={nP.navigateTo}>{nP.title}</Button>}
      {nP.cElementType == 'Icon' && <AppIcon name={nP.name} />}
      {nP.cElementType == 'Image' && <img src={nP.url} />}
    </Box>
  </Grid>;
};
CElement.displayName = 'CElement';

const CElementSettingSchema = getCElementSchema() as JSONSchema7;
const uiSchema = {
    "ui:title": " ",
    "ui:order": ["*", "item", "box"],
    cElementType: {
        "ui:widget": "hidden",
    }
}
export const CElementSettings = () => {
    return <CmpSettings uiSchema={uiSchema} schema={CElementSettingSchema} />
};
const CElementDefaultProps: CElementProps = {
    cElementType: "Text",
    content: "edit me...",
    typography: {
      variant: "body1",
    },
};
const craft: CmpCraftStatic = {
    displayName: 'Element',
    props: CElementDefaultProps,
    related: {
        settings: CElementSettings,
    },
    rules: {
        canDrop(dropTarget, self, helpers): boolean {
            let parents = [dropTarget.data.type];
            for (let ancestorId of helpers(dropTarget.id).ancestors()) {
                parents.push(helpers(ancestorId).get().data.type);
            }
            console.log('CElement.canDrop', parents);
            for (let parent of parents) {
                console.log('CElement.canDrop', parent, parent === CForm || parent === CLayout);
                if (parent === CForm || parent === CLayout) return true;
            }
            return false;
        }
    },
};
CElement.craft = craft;
