import { Element, useNode } from '@craftjs/core';
import React from 'react';

import { CButton } from './CButton';
import {
  CPaper,
  ContainerSettings,
  ContainerDefaultProps,
} from './CPaper';
import { CText } from './CText';

export const CardTop = ({ children }) => {
  const {
    connectors: { connect },
  } = useNode();
  return (
    <div
      ref={connect}
      className="text-only"
      style={{
        padding: '10px',
        marginBottom: '10px',
        borderBottom: '1px solid #eee',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
      }}
    >
      {children}
    </div>
  );
};

CardTop.craft = {
  rules: {
    canMoveIn: (incomingNode) => incomingNode.data.type === CText,
  },
};

export const CardBottom = ({ children }) => {
  const {
    connectors: { connect },
  } = useNode();
  return (
    <div style={{ padding: '10px 0' }} ref={connect}>
      {children}
    </div>
  );
};

CardBottom.craft = {
  rules: {
    canMoveIn: (incomingNode) => incomingNode.data.type === CButton,
  },
};

export const Card = ({ background = 'white', padding = 20 }) => {
  return (
    <CPaper background={background} padding={padding}>
      <Element canvas id="text" is={CardTop}>
        <CText text="Only texts" />
        <CText text="are allowed up here" />
      </Element>
      <Element canvas id="buttons" is={CardBottom}>
        <CButton size="small" text="Only buttons down here" />
      </Element>
    </CPaper>
  );
};

Card.craft = {
  props: ContainerDefaultProps,
  related: {
    settings: ContainerSettings,
  },
};
