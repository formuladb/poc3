import React, { useState, useEffect } from 'react';
import {
    makeStyles, Fab, Theme, Drawer, Snackbar,
} from '@material-ui/core';
import EditDbIcon from '@material-ui/icons/Storage';
import { Topbar } from './Topbar';
import { SettingsPanel } from './SettingsPanel';
import { Toolbox } from './Toolbox';
import { ListDatagrid } from '../list/ListDatagrid';
import { useListController } from 'react-admin';


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
        if (editorOpen) document.body.style.paddingRight = '320px';
        else document.body.style.paddingRight = '0px';
    }, [editorOpen]);

    return (<>
        <Fab onClick={() => { setEditorOpen(!editorOpen) }}
            className={classes.fab}
            color={editorOpen ? undefined : "primary"} aria-label="edit" size="small"
            data-testid="FrmdbToggleDbEditorBtn"
        >
            <EditDbIcon />
        </Fab>
        <Drawer variant="persistent" anchor="bottom" open={editorOpen}
            onClose={() => setEditorOpen(false)}
        >
            {editorOpen && <div style={{ height: '200px' }}>
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
