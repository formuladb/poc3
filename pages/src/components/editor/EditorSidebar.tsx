import React, { useState, useEffect } from 'react';
import {
    makeStyles, Fab, Theme, Drawer, Snackbar,
} from '@material-ui/core';
import EditPageIcon from '@material-ui/icons/Brush';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { Topbar } from './Topbar';
import { SettingsPanel } from './SettingsPanel';
import { Toolbox } from './Toolbox';
import { useDispatch } from 'react-redux';
import { toggleEditor } from './actions';


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

    const dispatch = useDispatch();

    return (<>
        <Fab onClick={() => { dispatch(toggleEditor(editorOpen)); setEditorOpen(!editorOpen) }}
            className={classes.fab}
            color={editorOpen ? undefined : "primary"} aria-label="edit" size="small"
            data-testid="FrmdbTogglePageEditorBtn"
        >
            <EditPageIcon />
        </Fab>
        <ThemeProvider theme={EditorTheme}>
            <Drawer variant="persistent" anchor="right" open={editorOpen}
                onClose={() => setEditorOpen(false)}
            >
                {editorOpen && <div style={{ width: '320px' }}>
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
        </ThemeProvider>
    </>);
}


const EditorTheme = createMuiTheme({
    palette: {
        primary: {
            main: '#4f3cc9',
        },
        secondary: {
            light: '#5f5fc4',
            main: '#283593',
            dark: '#001064',
            contrastText: '#fff',
        },
        background: {
            default: '#fcfcfe',
        },
        type: 'light' as 'light',
    },
    shape: {
        borderRadius: 10,
    },
    overrides: {
        MuiPaper: {
            elevation1: {
                boxShadow: 'none',
            },
            root: {
                border: '1px solid #e0e0e3',
                backgroundClip: 'padding-box',
            },
        },
        MuiButton: {
            contained: {
                backgroundColor: '#fff',
                color: '#4f3cc9',
                boxShadow: 'none',
            },
        },
        MuiAppBar: {
            colorSecondary: {
                color: '#808080',
                backgroundColor: '#fff',
            },
        },
        MuiLinearProgress: {
            colorPrimary: {
                backgroundColor: '#f5f5f5',
            },
            barColorPrimary: {
                backgroundColor: '#d7d7d7',
            },
        },
        MuiFilledInput: {
            root: {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                '&$disabled': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
            },
        },
    },
});