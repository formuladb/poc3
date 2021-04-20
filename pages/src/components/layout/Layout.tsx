import * as React from 'react';
import { useSelector } from 'react-redux';
import { Layout, LayoutProps, ReduxState, useGetIdentity } from 'react-admin';
import AppBar from './AppBar';
import { Sidebar } from './Sidebar';
import { lightTheme } from './themes/light';
import { darkTheme } from './themes/dark';
import Menu from './Menu';
import { useCurrentResource } from '../../useCurrentResource';

export type ThemeName = 'light' | 'dark';
interface AppState extends ReduxState {
    theme: ThemeName;
}

export default (props: LayoutProps) => {
    const theme = useSelector((state: AppState) =>
        state.theme === 'dark' ? darkTheme : lightTheme
    );
    const { identity, loading: identityLoading, error } = useGetIdentity();
    const frmdbResource = useCurrentResource();
    const layoutType = frmdbResource?.options?.[identity?.role || 'frmdb_anon']?.layoutType;
    const sideBarCmp = layoutType === "ONE_PAGE" ? EmptySidebar : Sidebar;
    console.log('XXX', identity, frmdbResource, layoutType);
    return (
        <Layout
            {...props}
            appBar={AppBar}
            sidebar={sideBarCmp}
            menu={Menu}
            theme={theme}
        />
    );
};

function EmptySidebar() {
    return <div style={{width: '15px'}}></div>;
}