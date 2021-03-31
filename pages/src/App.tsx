import React from 'react';
import { set as _set } from 'lodash';
import {
    AdminContext, AdminUI, Resource, useDataProvider, useGetList,
    DataProvider, I18nProvider, Loading, AuthProvider, useTranslate, useAuthenticated, resolveBrowserLocale, useSetLocale, useLocale
} from 'react-admin';
import { useEffect, useState } from 'react';

import { ListGuesser } from 'react-admin';
import { EditGuesser } from 'react-admin';
import Layout from './components/layout/Layout';
import { EditablePage } from './components/EditablePage';
import themeReducer from './configuration/themeReducer';
import { Route } from 'react-router-dom';
import Configuration from './configuration/Configuration';
import LoadingIcon from '@material-ui/icons/Loop';
import { useResources } from './useResources';
import { AppIcon } from './components/generic/AppIcon';
import { createBrowserHistory } from 'history';
import { EMPTY_LOCALE } from './i18nProviderBuilder';

const history = createBrowserHistory({
    basename: window.location.pathname.split('/').filter(i => i)[0]||'',
});

type AppProps = {
    dataProvider: DataProvider,
    authProvider: AuthProvider,
    i18nProvider: I18nProvider | undefined,
};

function App(props: AppProps) {

    return (
        <AdminContext {...props}
            customReducers={{ theme: themeReducer }}
            history={history}
        >
            <AsyncResources />
        </AdminContext>
    );
}

function AsyncResources() {
    const resources = useResources();
    //console.debug(resources);

    const locale = useLocale();
    const setLocale = useSetLocale();
    useEffect(() => {
        if (EMPTY_LOCALE === locale) {
            let newLocale = localStorage.getItem('frmdb-locale');
            if (!newLocale) newLocale = resolveBrowserLocale();
            console.log("user's locale", newLocale);    
            setLocale(newLocale); localStorage.setItem('frmdb-locale', newLocale);    
        }
    });

    return (
        <AdminUI
            layout={Layout}
            customRoutes={customRoutes}
            ready={Ready}
        >
            {resources.filter(r => r.resource_type === "RESOURCE").map(resource => {
                let resourceProps = {
                    list: ListPage,
                    edit: EditPage,
                    create: CreatePage,
                    icon: () => <AppIcon name={resource.icon} />,
                };

                return (
                    <Resource name={resource.id} key={resource.id}
                        {...resourceProps}
                    />
                )
            })}
        </AdminUI>
    );
}

const ListPage = (props) => <EditablePage {...props} pageType="List" />; 
const EditPage = (props) => <EditablePage {...props} pageType="Edit" />; 
const CreatePage = (props) => <EditablePage {...props} pageType="Create" />; 

const customRoutes = [
    <Route exact path="/configuration" render={() => <Configuration />} />,
];

export default App;

function Ready() {
    const translate = useTranslate();
    const [msg, setMsg] = useState<string>('Incarcare...');
    return <><span><LoadingIcon /></span><span>{msg}</span></>;
}
