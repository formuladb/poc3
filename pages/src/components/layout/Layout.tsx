import * as React from 'react';
import { useSelector } from 'react-redux';
import { Layout, LayoutProps, ReduxState } from 'react-admin';
import AppBar from './AppBar';
import { Sidebar } from './Sidebar';
import { lightTheme } from './themes/light';
import { darkTheme } from './themes/dark';
import Menu from './Menu';

export type ThemeName = 'light' | 'dark';
interface AppState extends ReduxState {
    theme: ThemeName;
}

export default (props: LayoutProps) => {
    const theme = useSelector((state: AppState) =>
        state.theme === 'dark' ? darkTheme : lightTheme
    );
    return (
        <Layout
            {...props}
            appBar={AppBar}
            sidebar={Sidebar}
            menu={Menu}
            theme={theme}
        />
    );
};
