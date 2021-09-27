import { Editor } from '@craftjs/core';
import {
    makeStyles, Theme,
} from '@material-ui/core';
import React, { ReactElement } from 'react';

import { CButton } from './page/CButton';
import { Card, CardBottom, CardTop } from './page/Card';
import { CPaper } from './page/CPaper';
import { CSection } from './page/CSection';
import { CText } from './page/CText';
import { CRow } from './page/CRow';
import { CColumn } from './page/CColumn';
import { CForm } from './form/CForm';
import { CInput } from './form/CInput';
import { CList } from './list/CList';
import EditablePageContent from './EditablePageContent';
import { RenderNode } from './editor/RenderNode';
import { EditorSidebar } from './editor/EditorSidebar';
import { Create, Edit } from 'react-admin';
import { CPage } from './page/CPage';
import { ListPage } from './page/ListPage';
import { CPageProps } from '../core/entity/page';
import { useCurrentUser } from './form/useCurrentUser';

export interface EditablePageProps {
    pageType: CPageProps['cPageType'];
}
export function EditablePage({
    pageType,
    ...pageComponentRaProps
}: EditablePageProps) {

    console.log("render");
    const currentUser = useCurrentUser();

    return (
        <div className="frmdb-editable-page" style={{ margin: '0 auto', width: '100%' }}>
            <Editor enabled={false}
                resolver={{
                    Card,
                    CButton,
                    CText,
                    CPaper,
                    CSection,
                    CardTop,
                    CardBottom,
                    CRow,
                    CColumn,
                    CForm,
                    CInput,
                    CList,
                    CPage,
                }}
                onRender={RenderNode}
            >
                <div key="Create">
                    {pageType === "Create" &&
                        <Create {...pageComponentRaProps}><EditablePageContent pageType={pageType} /></Create>}
                </div>
                <div key="Edit">
                    {pageType === "Edit" &&
                        <Edit {...pageComponentRaProps}><EditablePageContent pageType={pageType} /></Edit>}
                </div>
                <div key="List">
                    {pageType === "List" &&
                        <ListPage key="List" {...pageComponentRaProps}><Na><EditablePageContent pageType={pageType} /></Na></ListPage>}
                </div>

                <EditorSidebar />
            </Editor>
        </div>
    );
}

const Na = ({ children, ...props }) => <div>{children}</div>;