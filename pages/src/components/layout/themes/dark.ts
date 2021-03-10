export const darkTheme = {
    palette: {
        primary: {
            main: '#90caf9',
        },
        secondary: {
            main: '#FBBA72',
        },
        type: 'dark' as 'dark', // Switching the dark mode on is a single property value change.
    },
    overrides: {
        MuiAppBar: {
            colorSecondary: {
                color: '#ffffffb3',
                backgroundColor: '#616161e6',
            },
        },
    },
};
