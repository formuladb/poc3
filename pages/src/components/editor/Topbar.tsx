import { useEditor, SerializedNode } from '@craftjs/core';
import { ROOT_NODE } from '@craftjs/utils';

import {
    FormControlLabel,
    Switch,
    Grid,
    Button as MaterialButton,
    ButtonGroup,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Snackbar,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import UndoIcon from '@material-ui/icons/Undo';
import RedoIcon from '@material-ui/icons/Redo';
import { useMutation } from 'react-admin';
import { useLocation } from 'react-router-dom';
import { parseLocation } from './Topbar.utils';
import SavePageButton from './SavePageButton';
import { AppIcon } from '../generic/AppIcon';

export const Topbar = ({ editorEnabled }: { editorEnabled: boolean }) => {
    const { actions, query, enabled, canUndo, canRedo } = useEditor(
        (state, query) => ({
            enabled: state.options.enabled,
            canUndo: query.history.canUndo(),
            canRedo: query.history.canRedo(),
        })
    );

    useEffect(() => {
        if (editorEnabled) {
            actions.setOptions((options) => (options.enabled = true));
        } else {
            actions.setOptions((options) => (options.enabled = false));
        }
    }, [editorEnabled, actions]);

    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [snackbarMessage, setSnackbarMessage] = useState<string | null>();
    const [stateToLoad, setStateToLoad] = useState<string | null>(null);

    const location = useLocation();
    let pageData = parseLocation(location.pathname);

    return (
        <div style={{backgroundColor: "#cbe8e7", padding: "10px", marginTop: "40px", marginBottom: "10px"}}>
            <Grid container alignItems="center">
                <Grid item xs>
                    <ButtonGroup variant="text">
                        <MaterialButton
                            disabled={!canUndo}
                            onClick={() => actions.history.undo()}
                            style={{ marginRight: '10px' }}
                        >
                            <UndoIcon />
                        </MaterialButton>
                        <MaterialButton
                            disabled={!canRedo}
                            onClick={() => actions.history.redo()}
                            style={{ marginRight: '10px' }}
                        >
                            <RedoIcon />
                        </MaterialButton>
                        <SavePageButton pageId={pageData.pageId} pageIcon="TBDIcon" />
                        <MaterialButton disabled>
                            <AppIcon name="font-awesome/fontawesome-solid-database-computer-development-directory-memory-storage" />
                        </MaterialButton>
                    </ButtonGroup>
                </Grid>
                {/* <Grid item>
                    <MaterialButton
                        className="load-state-btn"
                        size="small"
                        variant="outlined"
                        color="secondary"
                        onClick={() => setDialogOpen(true)}
                    >
                        Load
                    </MaterialButton>
                    <Dialog
                        open={dialogOpen}
                        onClose={() => setDialogOpen(false)}
                        fullWidth
                        maxWidth="md"
                    >
                        <DialogTitle id="alert-dialog-title">Load state</DialogTitle>
                        <DialogContent>
                            <TextField
                                multiline
                                fullWidth
                                placeholder='Paste the contents that was copied from the "Copy Current State" button'
                                size="small"
                                value={stateToLoad || ''}
                                onChange={(e) => setStateToLoad(e.target.value as any)}
                            />
                        </DialogContent>
                        <DialogActions>
                            <MaterialButton
                                onClick={() => setDialogOpen(false)}
                                color="primary"
                            >
                                Cancel
                            </MaterialButton>
                            <MaterialButton
                                onClick={() => {
                                    setDialogOpen(false);
                                    //const json = lz.decompress(lz.decodeBase64(stateToLoad));
                                    const json = stateToLoad;
                                    actions.deserialize(json || '{}');
                                    setSnackbarMessage('State loaded');
                                }}
                                color="primary"
                                autoFocus
                            >
                                Load
                            </MaterialButton>
                        </DialogActions>
                    </Dialog>
                    <Snackbar
                        autoHideDuration={1000}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                        }}
                        open={!!snackbarMessage}
                        onClose={() => setSnackbarMessage(null)}
                        message={<span>{snackbarMessage}</span>}
                    />
                </Grid> */}
            </Grid>
        </div>
    );
};
