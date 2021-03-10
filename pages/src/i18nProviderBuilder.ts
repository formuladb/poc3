import lodashGet from 'lodash/get';
import lodashSet from 'lodash/set';
import { DataProvider, I18nProvider, AuthProvider } from 'react-admin';
import { FrmdbDictionary, FrmdbSystemParams } from './core-domain/records';
import polyglotI18nProvider from 'ra-i18n-polyglot';

import englishMessages from 'ra-language-english';

//TODO: lazy import
import roMessages from 'ra-language-romanian';
import frMessages from 'ra-language-french';
import deMessages from 'ra-language-german';
import esMessages from '@blackbox-vision/ra-language-spanish';
import elMessages from 'ra-language-greek';

import { resolveBrowserLocale } from 'react-admin';

const Lang2MessagesMap = {
    'en': englishMessages,
    'ro': roMessages,
    'fr': frMessages,
    'de': deMessages,
    'es': esMessages,
    'el': elMessages,
};

async function changeLocale(locale: string, dataProvider: DataProvider, authProvider: AuthProvider) {
    let raMessages = Lang2MessagesMap[locale];

    await authProvider.checkAuth(null);
    console.log(`changing locale to `, locale);

    let dict = await dataProvider.getList<FrmdbDictionary>("frmdb_dictionary", {
        pagination: { page: 1, perPage: 5000 },
        sort: { field: 'id', order: 'ASC' },
        filter: {}
    });
    let frmdbAppMessages: object = {};
    for (let d of dict.data) {
        lodashSet(frmdbAppMessages, d.id, d[locale]);
    }
    console.log("locale change", locale, raMessages, frmdbAppMessages);

    return {
        ...raMessages,
        ...frmdbAppMessages,
    };
}

export const EMPTY_LOCALE = "empty";

export default function i18nProviderBuilder(dataProvider: DataProvider, authProvider: AuthProvider): I18nProvider {
    let firstCall: boolean = true;

    let i18nProv = polyglotI18nProvider(loc => {
        if (firstCall) {
            firstCall = false;
            return englishMessages;
        } else {
            return changeLocale(loc, dataProvider, authProvider);
        }
    }, EMPTY_LOCALE);

    return i18nProv;
};
