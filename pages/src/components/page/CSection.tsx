import { useNode } from '@craftjs/core';
import React from 'react';
import { CSectionProps } from '../../core-domain/components/CSection';

export const CSection = (nP: CSectionProps) => {
  const {
    connectors: { connect, drag },
  } = useNode();
  return (
    <div
      ref={(ref: any) => connect(drag(ref))}
    >
    </div>
  );
};
