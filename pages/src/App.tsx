import React from 'react';
import { set as _set } from 'lodash';
import {
    AdminContext, AdminUI, Resource, useDataProvider, useGetList,
    DataProvider, I18nProvider, Loading, AuthProvider, useTranslate, useAuthenticated, resolveBrowserLocale, useSetLocale, useLocale
} from 'react-admin';
import { useEffect, useState } from 'react';

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
import { Dashboard } from './components/layout/Dashboard';
import { useSystemParams } from './useSystemParams';
import { LOCALE } from './core-domain/records';
import i18nProviderBuilder from './i18nProviderBuilder';

const history = createBrowserHistory({
    basename: window.location.pathname.split('/').filter(i => i)[0] || '',
});

type AppProps = {
    dataProvider: DataProvider,
    authProvider: AuthProvider,
};

function App(props: AppProps) {

    const i18nProvider = i18nProviderBuilder(props.dataProvider, props.authProvider);
    const [locale, setLocale] = useState(i18nProvider.getLocale());
    const systemParams = useSystemParams(props.dataProvider);
    useEffect(() => {
        let newLocale = systemParams[LOCALE]?.val;
        if (newLocale) {
            console.log("setting user's locale", newLocale);
            i18nProvider.changeLocale(newLocale)
                .then(() => {
                    console.log("User locale set to ", newLocale);
                    setLocale(newLocale)}
                );
        } else console.log("No locale yet loaded for this app");
    }, [systemParams]);

    return <>
        { EMPTY_LOCALE === locale &&
            <Loading loadingPrimary="app.page.loading" loadingSecondary="app.message.loading" />}
        { EMPTY_LOCALE !== locale &&
            <AdminContext {...props}
                i18nProvider={i18nProvider}
                customReducers={{ theme: themeReducer }}
                history={history}
            >
                <AsyncResources />
            </AdminContext>
        }
    </>;
}

function AsyncResources() {
    const resources = useResources();

    return (
        <AdminUI
            layout={Layout}
            customRoutes={customRoutes}
            ready={Ready}
            dashboard={Dashboard}
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
