import { useNode } from '@craftjs/core';
import { Slider } from '@material-ui/core';
import { Paper, FormControl, FormLabel } from '@material-ui/core';
import ColorPicker from 'material-ui-color-picker';
import React from 'react';

export function CPaper({ 
  background="transparent", 
  padding, 
  elevation=0, 
  children=null as null | React.ReactNode,
}) {
  const {
    connectors: { connect, drag },
  } = useNode();
  return (
    <Paper
      ref={(ref: any) => connect(drag(ref))}
      elevation={elevation}
      style={{ margin: '5px 0', background, padding: `${padding}px` }}
    >
      {children}
    </Paper>
  );
};

export const ContainerSettings = () => {
  const {
    background,
    padding,
    actions: { setProp },
  } = useNode((node) => ({
    background: node.data.props.background,
    padding: node.data.props.padding,
  }));

  return (
    <div>
      <FormControl fullWidth={true} margin="normal" component="fieldset">
        <FormLabel component="legend">Background</FormLabel>
        <ColorPicker
          value={background}
          onChange={(color) => {
            setProp((props) => (props.background = color), 500);
          }}
        />
      </FormControl>
      <FormControl fullWidth={true} margin="normal" component="fieldset">
        <FormLabel component="legend">Padding</FormLabel>
        <Slider
          defaultValue={padding}
          onChange={(_, value) =>
            setProp((props) => (props.padding = value), 500)
          }
        />
      </FormControl>
    </div>
  );
};

export const ContainerDefaultProps = {
  background: '#ffffff',
  padding: 3,
};

CPaper.craft = {
  displayName: 'Paper',
  props: ContainerDefaultProps,
  related: {
    settings: ContainerSettings,
  },
};
