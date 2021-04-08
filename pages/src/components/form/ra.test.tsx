import React from "react";
import {
    findAllByText, prettyDOM, render, wait, screen
} from '@testing-library/react';
import {
    DataProvider, DataProviderContext,
    Edit, SimpleForm, TextInput, GetOneParams,
} from 'react-admin';
import { renderWithRedux } from 'ra-test';

test('basic test', async () => {
    const defaultEditProps = {
        basePath: '',
        id: '123',
        resource: 'posts',
        location: {
            pathname: '/customers/123',
            search: '',
            state: {},
            hash: '',
        },
        match: {
            params: { id: 123 },
            isExact: true,
            path: '/customers/123',
            url: '/customers/123',
        },
        undoable: false,
    };

    const dataProvider = ({
        getOne: () =>
            Promise.resolve({
                data: { id: 123, title: 'lorem' },
            }),
        update: (_, { data }) => Promise.resolve({ data }),
    } as unknown) as DataProvider;

    const EditToolbar = props => (
        <div></div>
    );

    const {
        findByDisplayValue,
    } = renderWithRedux(
        <DataProviderContext.Provider value={dataProvider}>
            <Edit {...defaultEditProps}>
                <SimpleForm toolbar={<EditToolbar />}>
                    <TextInput source="title" />
                </SimpleForm>
            </Edit>
        </DataProviderContext.Provider>
        , { admin: { resources: { posts: { data: {} } } } }
    );
    let el = await findByDisplayValue('lorem');
});
