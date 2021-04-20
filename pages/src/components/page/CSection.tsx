import { useNode } from '@craftjs/core';
import { Slider } from '@material-ui/core';
import { Paper, FormControl, FormLabel } from '@material-ui/core';
import ColorPicker from 'material-ui-color-picker';
import React from 'react';

export const CSection = ({ children=null as null | React.ReactNode }) => {
  const {
    connectors: { connect, drag },
  } = useNode();
  return (
    <div
      ref={(ref: any) => connect(drag(ref))}
    >
      {children}
    </div>
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

CSection.craft = {
  props: ContainerDefaultProps,
  related: {
    settings: ContainerSettings,
  },
};
