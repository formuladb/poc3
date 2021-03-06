import { CPageNode } from '@core/entity/page';

export const prw_tables__id: CPageNode = {
    "_tag": "CPage",
    "_id": "ROOT",
    "cPageType": "Edit",
    "children": [
        {
            "_tag": "CForm",
            "_id": "Ek4N5ig9v",
            "resource": "prw_tables",
            "children": [
                {
                    "_tag": "CLayout",
                    "_id": "MainRowId",
                    "children": [
                        {
                            "_tag": "CInput",
                            "_id": "3Ubid",
                            "cInputType": "TextField",
                            "resource": "prw_tables",
                            "source": "id",
                            "variant": "standard",
                            "disabled": false
                        },
                        {
                            "_tag": "CInput",
                            "_id": "3Ubidt",
                            "cInputType": "TextField",
                            "resource": "prw_tables",
                            "source": "id_type",
                            "variant": "standard",
                            "disabled": false
                        },
                        {
                            "_tag": "CInput",
                            "_id": "3Ubparent",
                            "cInputType": "TextField",
                            "resource": "prw_tables",
                            "source": "parent",
                            "variant": "standard",
                            "disabled": false
                        },
                        {
                            "_tag": "CInput",
                            "_id": "3Ubresource_type",
                            "cInputType": "TextField",
                            "resource": "prw_tables",
                            "source": "resource_type",
                            "variant": "standard",
                            "disabled": false
                        },
                        {
                            "_tag": "CInput",
                            "_id": "3Ubicon",
                            "cInputType": "TextField",
                            "resource": "prw_tables",
                            "source": "icon",
                            "variant": "standard",
                            "disabled": false
                        },
                        {
                            "_tag": "CInput",
                            "_id": "3Ubmenu_order",
                            "cInputType": "NumberField",
                            "resource": "prw_tables",
                            "source": "menu_order",
                            "variant": "standard",
                            "disabled": false
                        },
                        {
                            "_tag": "CInput",
                            "_id": "3Uboptions",
                            "cInputType": "Json",
                            "resource": "prw_tables",
                            "source": "options",
                            "variant": "standard",
                            "disabled": false
                        },
                        {
                            "_tag": "CInput",
                            "_id": "3Ubmeta_created_at",
                            "cInputType": "DateTimeField",
                            "resource": "prw_tables",
                            "source": "meta_created_at",
                            "variant": "standard",
                            "disabled": true
                        },
                        {
                            "_tag": "CInput",
                            "_id": "3Ubmeta_created_by",
                            "cInputType": "TextField",
                            "resource": "prw_tables",
                            "source": "meta_created_by",
                            "variant": "standard",
                            "disabled": true
                        },
                        {
                            "_tag": "CInput",
                            "_id": "3Ubmeta_updated_at",
                            "cInputType": "DateTimeField",
                            "resource": "prw_tables",
                            "source": "meta_updated_at",
                            "variant": "standard",
                            "disabled": true
                        },
                        {
                            "_tag": "CInput",
                            "_id": "3Ubmeta_updated_by",
                            "cInputType": "TextField",
                            "resource": "prw_tables",
                            "source": "meta_updated_by",
                            "variant": "standard",
                            "disabled": true
                        }
                    ]
                }
            ]
        },
        {
            "_tag": "CBlock",
            "_id": "jW9Z4",
            "cBlockType": "Heading",
            "title": "Columns",
        },
        {
            "_tag": "CList",
            "_id": "lUQUqXjYa",
            "cListType": "Table",
            "resource": "prw_table_columns",
            "labelSource": "id",
            "editable": false,
            "refToParentListFieldName": "prw_table_id",
            "isSubListOf": "prw_tables",
            "enabledActions": [
                {
                    "actionType": "CREATE"
                }
            ],
            fields: [
                {
                    cInputType: "TextField",
                    resource: "prw_table_columns",
                    source: "c_column_name",
                    disabled: false,
                },
                {
                    cInputType: "TextField",
                    resource: "prw_table_columns",
                    source: "c_data_type",
                    disabled: false,
                },
                {
                    cInputType: "TextField",
                    resource: "prw_table_columns",
                    source: "c_check",
                    disabled: false,
                },
            ]
        },
        {
            "_tag": "CBlock",
            "_id": "jW9Z3",
            "cBlockType": "Heading",
            "title": "Pages",
        },
        {
            "_tag": "CList",
            "_id": "JiQJ_ri5t",
            "cListType": "Table",
            "resource": "prw_pages",
            "labelSource": "id",
            "editable": false,
            "isSubListOf": "prw_tables",
            "refToParentListFieldName": "prw_table_id"
        }
    ]
};
