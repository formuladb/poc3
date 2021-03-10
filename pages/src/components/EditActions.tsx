import React from "react";
import { TopToolbar, Record, ListButton } from 'react-admin';

export const EditActions = ({ basePath, data }: { basePath?: string, data?: Record }) => (
    <TopToolbar>
      <ListButton basePath={basePath} record={data} label="ra.action.back" />
    </TopToolbar>
  );
  