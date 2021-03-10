export type ThemeName = 'light' | 'dark';

export const CHANGE_THEME = 'CHANGE_THEME';

export const changeTheme = (theme: ThemeName) => ({
    type: CHANGE_THEME,
    payload: theme,
});
