import { useNode } from '@craftjs/core';
import { Grid } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import ContentEditable from 'react-contenteditable';
import { CTextProps } from '../../core/entity/page';
import CTextPropsSchema from '../../core-domain/json-schemas/CTextProps.json';
import { JSONSchema7 } from 'json-schema';
import { CmpSettings } from '../editor/CmpSettings';

export const CText = ({ text, textAlign, fontWeight }: CTextProps) => {
  const {
    connectors: { connect, drag },
    selected,
    actions: { setProp },
  } = useNode((state) => ({
    selected: state.events.selected,
    dragged: state.events.dragged,
  }));

  const [editable, setEditable] = useState(false);

  useEffect(() => {
    if (selected) {
      return;
    }

    setEditable(false);
  }, [selected]);

  return (
    <Grid item
      ref={connect as (instance: HTMLDivElement | null) => void}
      onClick={() => selected && setEditable(true)}
    >
      <ContentEditable
        html={text}
        disabled={!editable}
        onChange={(e) =>
          setProp(
            (props) =>
              (props.text = e.target.value.replace(/<\/?[^>]+(>|$)/g, '')),
            500
          )
        }
        tagName="p"
        style={{ textAlign, fontWeight }}
      />
    </Grid>
  );
};

const CTextSettingSchema = CTextPropsSchema as JSONSchema7;
console.log('CTextPropsSchema=', CTextPropsSchema);
export const CTextSettings = () => {
    return <CmpSettings schema={CTextSettingSchema} />
};
export const TextDefaultProps = {
  text: 'Hi',
  fontSize: 20,
};

CText.craft = {
  displayName: 'Text',
  props: TextDefaultProps,
  related: {
    settings: CTextSettings,
  },
};
