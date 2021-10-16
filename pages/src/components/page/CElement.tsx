import { Grid, Box, Button } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { Node as CraftJsNode, useNode, useEditor } from '@craftjs/core';
import { CElementProps } from '../../core/entity/page';
import CElementPropsSchema from '../../core-domain/json-schemas/CElementProps.json';
import { JSONSchema7 } from 'json-schema';
import { CmpSettings } from '../editor/CmpSettings';
import { AppIcon } from '../generic/AppIcon';

export const CElement = (nP: CElementProps) => {
  const { query } = useEditor();
  const {
    node,
    connectors: { connect },
  } = useNode((node) => ({ node }));


  return <Grid item md={nP?.item?.width || 3} className="" ref={connect as (instance: HTMLDivElement | null) => void}>
    <Box {...nP.box?.borders} {...nP.box?.spacing}>
      {nP.cElementType == 'Text' &&
        <div dangerouslySetInnerHTML={{__html: nP.content}}></div>}
      {nP.cElementType == 'Action' &&
        <Button size={nP.size} variant={nP.variant} color={nP.color} href={nP.navigateTo}>{nP.title}</Button>}
      {nP.cElementType == 'Icon' && <AppIcon name={nP.name} />}
      {nP.cElementType == 'Image' && <img src={nP.url} />}
    </Box>
  </Grid>;
};
CElement.displayName = 'CElement';

// export const CElement = ({ text, textAlign, fontWeight }: CElementProps) => {
//   const {
//     connectors: { connect, drag },
//     selected,
//     actions: { setProp },
//   } = useNode((state) => ({
//     selected: state.events.selected,
//     dragged: state.events.dragged,
//   }));

//   const [editable, setEditable] = useState(false);

//   useEffect(() => {
//     if (selected) {
//       return;
//     }

//     setEditable(false);
//   }, [selected]);

//   return (
//     <Grid item
//       ref={connect as (instance: HTMLDivElement | null) => void}
//       onClick={() => selected && setEditable(true)}
//     >
//       <ContentEditable
//         html={text}
//         disabled={!editable}
//         onChange={(e) =>
//           setProp(
//             (props) =>
//               (props.text = e.target.value.replace(/<\/?[^>]+(>|$)/g, '')),
//             500
//           )
//         }
//         tagName="p"
//         style={{ textAlign, fontWeight }}
//       />
//     </Grid>
//   );
// };

const CElementSettingSchema = CElementPropsSchema as JSONSchema7;
console.log('CElementPropsSchema=', CElementPropsSchema);
export const CElementSettings = () => {
  return <CmpSettings schema={CElementSettingSchema} />
};
export const TextDefaultProps = {
  text: 'Hi',
  fontSize: 20,
};

CElement.craft = {
  displayName: 'Text',
  props: TextDefaultProps,
  related: {
    settings: CElementSettings,
  },
};
