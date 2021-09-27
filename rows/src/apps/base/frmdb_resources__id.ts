import { CPageNode } from '@core/entity/page';

export const frmdb_resources__id: CPageNode = {
    "_tag": "CPage",
    "_id": "ROOT",
    "cPageType": "Edit",
    "children": [
        {
            "_tag": "CForm",
            "_id": "Ek4N5ig9v",
            "resource": "frmdb_resources",
            "children": [
                {
                    "_tag": "CRow",
                    "_id": "MainRowId",
                    "background": "#ffffff",
                    "padding": 3,
                    "children": [
                        {
                            "_tag": "CInput",
                            "_id": "3Ubid",
                            "cInputType": "TextField",
                            "resource": "frmdb_resources",
                            "source": "id",
                            "variant": "standard"
                        },
                        {
                            "_tag": "CInput",
                            "_id": "3Ubmeta_created_at",
                            "cInputType": "DateTimeField",
                            "resource": "frmdb_resources",
                            "source": "meta_created_at",
                            "variant": "standard"
                        },
                        {
                            "_tag": "CInput",
                            "_id": "3Ubmeta_created_by",
                            "cInputType": "TextField",
                            "resource": "frmdb_resources",
                            "source": "meta_created_by",
                            "variant": "standard"
                        },
                        {
                            "_tag": "CInput",
                            "_id": "3Ubmeta_updated_at",
                            "cInputType": "DateTimeField",
                            "resource": "frmdb_resources",
                            "source": "meta_updated_at",
                            "variant": "standard"
                        },
                        {
                            "_tag": "CInput",
                            "_id": "3Ubmeta_updated_by",
                            "cInputType": "TextField",
                            "resource": "frmdb_resources",
                            "source": "meta_updated_by",
                            "variant": "standard"
                        },
                        {
                            "_tag": "CInput",
                            "_id": "3Ubparent",
                            "cInputType": "TextField",
                            "resource": "frmdb_resources",
                            "source": "parent",
                            "variant": "standard"
                        },
                        {
                            "_tag": "CInput",
                            "_id": "3Ubresource_type",
                            "cInputType": "TextField",
                            "resource": "frmdb_resources",
                            "source": "resource_type",
                            "variant": "standard"
                        },
                        {
                            "_tag": "CInput",
                            "_id": "3Ubicon",
                            "cInputType": "TextField",
                            "resource": "frmdb_resources",
                            "source": "icon",
                            "variant": "standard"
                        },
                        {
                            "_tag": "CInput",
                            "_id": "3Ubmenu_order",
                            "cInputType": "NumberField",
                            "resource": "frmdb_resources",
                            "source": "menu_order",
                            "variant": "standard"
                        },
                        {
                            "_tag": "CInput",
                            "_id": "3Uboptions",
                            "cInputType": "Json",
                            "resource": "frmdb_resources",
                            "source": "options",
                            "variant": "standard"
                        }
                    ]
                }
            ]
        },
        {
            "_tag": "CList",
            "_id": "JiQJ_ri5t",
            "cListType": "Table",
            "resource": "frmdb_pages",
            "labelSource": "id",
            "editable": false,
            "isSubListOf": "frmdb_resources",
            "refToParentListFieldName": "resource_id"
        }
    ]
};
