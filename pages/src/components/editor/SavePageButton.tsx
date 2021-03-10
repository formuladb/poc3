import { useEditor, SerializedNode } from '@craftjs/core';
import { ROOT_NODE } from '@craftjs/utils';
import {
    Button as MaterialButton,
    FormControl,
    FormLabel,
    RadioGroup,
    Radio,
    FormControlLabel,
} from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import React from 'react';
import { useDataProvider } from 'react-admin';
import { useMutation } from 'react-admin';
import { mapToTree } from './page-utils';

export default ({ pageId, pageIcon }) => {
    const { actions, query, enabled, canUndo, canRedo } = useEditor(
        (state, query) => ({
            enabled: state.options.enabled,
            canUndo: query.history.canUndo(),
            canRedo: query.history.canRedo(),
        })
    );

    const dataProvider = useDataProvider();

    const savePage = () => {
        let serializedNodes = query.getSerializedNodes();
        dataProvider.create("frmdb_pages", {
            data: {
                id: pageId,
                icon: pageIcon,
                content: mapToTree(ROOT_NODE, serializedNodes[ROOT_NODE], serializedNodes)
            }
        })
    };

    return (
        <MaterialButton color="primary" onClick={savePage} data-testid="FrmdbEditorSavePageBtn">
            <SaveIcon />
        </MaterialButton>
    );
};
