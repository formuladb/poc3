import { Editor, Frame, Element, useEditor, SerializedNode } from '@craftjs/core';
import {
    Typography, Paper, Grid, makeStyles, Fab, Drawer,
    Theme, Box, Button as MaterialButton, Snackbar
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';

import { RecordMap, useDataProvider, useAuthProvider, useAuthenticated } from 'react-admin';
import { useLocation } from 'react-router-dom';
import { parseLocation } from '../location_utils';
import { FrmdbResourceI, FrmdbResourceWithFields } from '../core/entity/FrmdbResource';
import { FrmdbPage } from '../core/entity/FrmdbPage';
import { EditablePageProps } from './EditablePage';
import { mapFromTree } from './editor/page-utils';
import { defaultEditPageContent } from './defaultEditPageContent';
import { defaultListPageContent } from './defaultListPageContent';
import { PageNode } from '../core/entity/page';
import { groupByUniqProp } from '../utils';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        padding: 0,
        background: 'rgb(252, 253, 253)',
    },
    fab: {
        position: 'absolute',
        bottom: '50vh',
        right: theme.spacing(1),
    },
}));

export default function EditablePageContent({
    pageType
}: EditablePageProps) {
    const { actions } = useEditor(
        (state, query) => ({
            enabled: state.options.enabled,
        })
    );

    const location = useLocation();
    const dataProvider = useDataProvider();
    const [savedPageAsTree, setSavedPageAsTree] = useState(null as null | PageNode);
    const authProvider = useAuthProvider();

    useEffect(() => {
        console.log(actions, location);

        (async () => {
            let pageData = parseLocation(location.pathname);
            const resource = pageData.parsedPath[0].resourceName;
            console.log(pageData, resource);

            await authProvider.checkAuth(null);

            let tmp = await dataProvider.getOne<FrmdbResourceWithFields>("frmdb_resource_with_fields", {id: resource});
            if (! tmp?.data) { console.warn(`cannot get columns for ${resource}`, tmp); return };
            let resourceWithFields = tmp.data;
        
            let res = await dataProvider.getOne<FrmdbPage>('frmdb_pages', { id: pageData.pageId })
                .catch((ex) => { console.log(ex); return null });
            let page = res?.data;

            let resources: null | RecordMap<FrmdbResourceI> =
                await dataProvider.getList<FrmdbResourceI>('frmdb_resources', {
                    pagination: { page: 1, perPage: 100 },
                    sort: { field: 'id', order: 'ASC' },
                    filter: {}
                }).then(res => {
                    if (!res) return null;
                    return groupByUniqProp(res.data, 'id');
                }).catch((ex) => { console.log(ex); return null });

            if (page) {
                console.log('PageContent', resourceWithFields, page);
                setSavedPageAsTree(page.content as any as PageNode);
            } else if (resources) {

                let savedPageAsTree = pageType === 'List' ?
                    defaultListPageContent(resourceWithFields, resources)
                    : pageType === 'Edit' ? defaultEditPageContent(resourceWithFields, false)
                        : defaultEditPageContent(resourceWithFields, true)
                    ;

                console.log('PageContent', resourceWithFields, savedPageAsTree);
                setSavedPageAsTree(savedPageAsTree);
            }
        })();
    }, [location]);

    useEffect(() => {
        console.log(actions, savedPageAsTree);

        if (savedPageAsTree) {
            let pageCraftFormat = {} as Record<string, SerializedNode>;
            mapFromTree(undefined, savedPageAsTree, pageCraftFormat);
            actions.deserialize(pageCraftFormat);
        }
    }, [actions, savedPageAsTree]);

    console.log("render")

    return (
        <div style={{padding: '10px'}}>
            <Frame>
                <Element canvas padding={1}>
                    {null}
                </Element>
            </Frame>
        </div>
    );
}

