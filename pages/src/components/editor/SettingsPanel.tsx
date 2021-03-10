import { useEditor } from '@craftjs/core';
import {
  Box,
  Chip,
  Grid,
  Typography,
  Button as MaterialButton,
} from '@material-ui/core';
import React from 'react';

export const SettingsPanel = () => {
  const { actions, selected } = useEditor((state, query) => {
    const currentNodeId = state.events.selected;
    console.log(currentNodeId);
    let selected: {
      id: string, 
      name: string, 
      displayName: string, 
      settings: any, 
      isDeletable: boolean} | undefined = undefined;

    if (currentNodeId) {
      selected = {
        id: currentNodeId,
        name: state.nodes[currentNodeId].data.name,
        displayName: state.nodes[currentNodeId].data.displayName,
        settings:
          state.nodes[currentNodeId].related &&
          state.nodes[currentNodeId].related.settings,
        isDeletable: query.node(currentNodeId).isDeletable(),
      };
    }

    return {
      selected,
    };
  });

  return selected ? (
    <Box bgcolor="rgba(0, 0, 0, 0.06)" mt={2} px={2} py={2}>
      <Grid container direction="column" spacing={0}>
        <Grid item>
          <Box pb={2}>
            <Grid container alignItems="center">
              <Grid item xs>
                <Typography variant="subtitle1">Selected</Typography>
              </Grid>
              <Grid item>
                <Chip size="small" color="primary" label={selected.displayName || selected.name} />
              </Grid>
            </Grid>
          </Box>
        </Grid>
        {selected.settings && React.createElement(selected.settings)}
      </Grid>
    </Box>
  ) : null;
};
