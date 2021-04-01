import React, { useState, useEffect } from 'react';
import {
    makeStyles, Fab, Theme, Drawer, Snackbar,
} from '@material-ui/core';
import EditPageIcon from '@material-ui/icons/Brush';
import { Topbar } from './Topbar';
import { SettingsPanel } from './SettingsPanel';
import { Toolbox } from './Toolbox';

const useStyles = makeStyles((theme: Theme) => ({
    fab: {
        position: 'fixed',
        bottom: theme.spacing(1),
        right: theme.spacing(1),
        zIndex: 9999,
    },
}));

export function EditorSidebar(props: any) {
    const classes = useStyles();
    const [editorOpen, setEditorOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState(null as string | null);

    useEffect(() => {
        if (editorOpen) document.body.style.paddingRight = '280px';
        else document.body.style.paddingRight = '0px';
    }, [editorOpen]);

    return (<>
        <Fab onClick={() => setEditorOpen(!editorOpen)}
            className={classes.fab}
            color={editorOpen ? undefined : "primary"} aria-label="edit" size="small"
            data-testid="FrmdbTogglePageEditorBtn"
        >
            <EditPageIcon />
        </Fab>
        <Drawer variant="persistent" anchor="right" open={editorOpen}
            onClose={() => setEditorOpen(false)}
        >
            {editorOpen && <div style={{ width: '280px' }}>
                <Topbar editorEnabled={editorOpen} />
                <Toolbox />
                <SettingsPanel />
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
            </div>}
        </Drawer>
    </>);
}
