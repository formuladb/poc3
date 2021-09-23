export const TOGGLE_EDITOR = 'TOGGLE_EDITOR';

export const toggleEditor = (editorOpened: boolean) => ({
    type: TOGGLE_EDITOR,
    payload: editorOpened,
});
