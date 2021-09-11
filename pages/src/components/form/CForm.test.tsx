import React from "react";
import {
    fireEvent, prettyDOM
} from '@testing-library/react';
import {
    DataProvider, DataProviderContext,
} from 'react-admin';
import { renderWithRedux } from 'ra-test';
import { EditablePage } from "../EditablePage";
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { PageNode } from "../../core-domain/page";
import { ThemeProvider, createMuiTheme } from '@material-ui/core';
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { FrmdbResourceWithFields } from "../../core/entity/FrmdbResource";

const server = setupServer(
    rest.get('/rows-db/rpc/frmdb_sp_table_columns',
        (req, res, ctx) => {
            console.log(req.url.href);
            if (req.url.searchParams.get('p_table_name') === 'order_items') {
                return res(ctx.json([
                    { "c_table_schema": "public", "c_table_name": "order_items", "c_column_name": "id", "c_required": true, "c_data_type": "integer", "c_column_description": null, "c_is_generated": false, "c_generation_expression": null, "c_is_updatable": true, "c_reference_to": null, "c_formula": null, "c_idx": 1 },
                    { "c_table_schema": "public", "c_table_name": "order_items", "c_column_name": "product__id", "c_required": true, "c_data_type": "integer", "c_column_description": null, "c_is_generated": false, "c_generation_expression": null, "c_is_updatable": true, "c_reference_to": "product_forms", "c_formula": null, "c_idx": 2 },
                    { "c_table_schema": "public", "c_table_name": "order_items", "c_column_name": "product__name", "c_required": true, "c_data_type": "text", "c_column_description": null, "c_is_generated": false, "c_generation_expression": null, "c_is_updatable": true, "c_reference_to": "product_forms", "c_formula": null, "c_idx": 2 },
                ]))
            } else if (req.url.searchParams.get('p_table_name') === 'products') {
                return res(ctx.json([
                    { "c_table_schema": "public", "c_table_name": "order_items", "c_column_name": "id", "c_required": true, "c_data_type": "integer", "c_column_description": null, "c_is_generated": false, "c_generation_expression": null, "c_is_updatable": true, "c_reference_to": null, "c_formula": null, "c_idx": 1 },
                    { "c_table_schema": "public", "c_table_name": "order_items", "c_column_name": "name", "c_required": true, "c_data_type": "text", "c_column_description": null, "c_is_generated": false, "c_generation_expression": null, "c_is_updatable": true, "c_reference_to": "product_forms", "c_formula": null, "c_idx": 2 },
                ]))
            } else throw new Error(`Unknown REST call ${req.url.href}`);
        }
    )
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test('CForm test', async () => {
    const history = createMemoryHistory();
    history.push('/order_items/123');

    const editProps = {
        basePath: '',
        id: '123',
        resource: 'order_items',
        location: {
            pathname: '/order_items/123',
            search: '',
            state: {},
            hash: '',
        },
        match: {
            params: { id: 123 },
            isExact: true,
            path: '/order_items/123',
            url: '/order_items/123',
        },
        undoable: false,
    };

    const dataProvider = ({
        getOne: (resource: string, opts: {id: string}) => {
            if (resource === "order_items") {
                console.log("order_items")
                return Promise.resolve({
                    data: { id: 123, product__id: '1', product_name: 'product1' },
                });
            } else if (resource === "products") {
                console.log("products")
                return Promise.resolve({
                    data: { id: 1, name: 'product1' },
                });
            } else if (resource === "frmdb_pages") {
                return Promise.resolve({
                    data: { id: 'order_items__id', icon: 'tbd', content: TestEditPage },
                });
            } else if (resource === "frmdb_resource_with_fields") {
                let ret: FrmdbResourceWithFields | null = null;
                if (opts.id === "order_items") {
                    ret = {
                        id: 'order_items',
                        field_defs: []
                    };
                } else if (opts.id === "products") {
                    ret = {
                        id: 'products',
                        field_defs: []
                    };
                }
                return Promise.resolve({data: ret});
            } else return Promise.reject(`${resource} not known`);
        },
        getList: (resource: string) => {
            if (resource === "products") {
                return Promise.resolve({
                    data: [{ id: 111, name: 'product1' }],
                    total: 1,
                });
            } else if (resource === "frmdb_resources") {
                return Promise.resolve({
                    data: [{ id: 'products' }, { id: 'order_items' }],
                    total: 2,
                });
            } else return Promise.reject(`Unknown ${JSON.stringify(resource)}`);
        },
        update: (_, { data }) => Promise.resolve({ data }),
        create: (_, { data }) => Promise.resolve({ data }),
    } as unknown) as DataProvider;

    const theme = createMuiTheme();

    const {
        findByDisplayValue,
        findByTestId,
        findByText,
    } = renderWithRedux(
        <Router history={history}>
            <ThemeProvider theme={theme}>
                <DataProviderContext.Provider value={dataProvider}>
                    <EditablePage pageType="Edit" {...editProps} />
                </DataProviderContext.Provider>
            </ThemeProvider>
        </Router>
        , {
            admin: {
                resources: {
                    products: { data: {} },
                    order_items: { data: {} },
                }
            }
        }
    );
    let inputField = await findByDisplayValue('123');
    await findByDisplayValue('1');
    await findByDisplayValue('product1');

    let toggleEditorBtn = await findByTestId('FrmdbTogglePageEditorBtn');
    fireEvent.click(toggleEditorBtn);
    let frmdbEditorSavePageBtn = await findByTestId('FrmdbEditorSavePageBtn');

    console.log(prettyDOM(inputField));
    fireEvent.click(inputField);

    // await findByText('Selected');
});

const TestEditPage: PageNode = {
    _tag: "CForm",
    _id: "ROOT",
    resource: "order_items",
    resourceId: "123",
    children: [{
        _id: "node1",
        _tag: "CInput",
        cInputType: "TextField",
        resource: "order_items",
        source: "id",
    }, {
        _id: "node2",
        _tag: "CInput",
        cInputType: "TextField",
        resource: "order_items",
        source: "product__id",
    }, {
        _id: "node3",
        _tag: "CInput",
        cInputType: "TextField",
        resource: "order_items",
        source: "product_name",
    }]
};
