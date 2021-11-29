import { CPageNode } from '@core/entity/page';

export const form11_10_181__id: CPageNode = {
    "_tag": "CPage",
    "_id": "ROOT",
    "cPageType": "Edit",
    "children": [
        {
            "_tag": "CForm",
            "_id": "Ek4N5ig9v",
            "resource": "form11_10_181",
            "children": [
                {
                    "_tag": "CLayout",
                    "_id": "MainRowId",
                    spacing: 3,
                    "box": {
                        "borders": {
                            "border": 1,
                            "borderColor": "text.primary",
                        },
                        spacing: {
                            padding: 2,
                        }
                    },
                    "children": [
                        {
                            "_tag": "CInput",
                            "_id": "jW9ZraEAL",
                            "cInputType": "TextField",
                            "resource": "form11_10_181",
                            "source": "tribunal",
                            "variant": "standard",
                            "disabled": false
                        },
                        {
                            "_tag": "CBlock",
                            "_id": "jW9ZraEAL2",
                            "cBlockType": "Heading",
                            "title": "C E R E R E",
                            "subtitle": "de verificare disponibilitate și<br/> rezervare denumire firmă",
                        },
                        {
                            "_tag": "CInput",
                            "_id": "3Ubid",
                            "cInputType": "TextField",
                            "resource": "form11_10_181",
                            "source": "id",
                            "variant": "standard"
                        },
                    ]
                },
                {
                    "_tag": "CLayout",
                    "_id": "Row2",
                    spacing: 3,
                    "box": {
                        "borders": {
                            "border": 1,
                            "borderColor": "text.primary",
                        },
                        spacing: {
                            padding: 2,
                            marginTop: 5,
                        }
                    },
                    "children": [
                        {
                            "_tag": "CBlock",
                            "_id": "jW9ZraEAL4",
                            "cBlockType": "Heading",
                            "subtitle": "Rezervarea firmei are caracter administrativ şi prealabil, asupra legalității formale a firmei urmând a se pronunța directorul ORCT/persoana desemnată ORCT, cu ocazia soluționării cererii de înregistrare în registrul comerțului. Denumirea rezervată nu este constitutivă de drepturi în sensul Legii nr.84/1998.",
                            item: {width: 12},
                        },
                    ]
                },
                {
                    "_tag": "CLayout",
                    "_id": "Row3",
                    spacing: 3,
                    "box": {
                        "borders": {
                            "border": 1,
                            "borderColor": "text.primary",
                        },
                        spacing: {
                            padding: 2,
                            marginTop: 4,
                        }
                    },
                    "children": [
                        { source: "subsemnat_nume", "cInputType": "TextField", "_tag": "CInput", _id: "sub1", resource: "form11_10_181"},
                        { source: "subsemnat_domiciliat_in", "cInputType": "TextField", "_tag": "CInput", _id: "sub2", resource: "form11_10_181"},
                        { source: "subsemnat_str", "cInputType": "TextField", "_tag": "CInput", _id: "sub3", resource: "form11_10_181"},
                        { source: "subsemnat_nr", "cInputType": "TextField", "_tag": "CInput", _id: "sub4", resource: "form11_10_181"},
                        { source: "subsemnat_bloc", "cInputType": "TextField", "_tag": "CInput", _id: "sub5", resource: "form11_10_181"},
                        { source: "subsemnat_scara", "cInputType": "TextField", "_tag": "CInput", _id: "sub6", resource: "form11_10_181"},
                        { source: "subsemnat_etaj", "cInputType": "TextField", "_tag": "CInput", _id: "sub7", resource: "form11_10_181"},

                        {
                            "_tag": "CBlock",
                            "_id": "sec5",
                            "cBlockType": "Heading",
                            "body": "2. <b>solicit</b> verificare disponibilitate și rezervare firmă(2) pentru",
                            item: { width: 12 }
                        },

                        { source: "autorizare", "cInputType": "BooleanField", "_tag": "CInput", _id: "check1", resource: "form11_10_181", item: {width: 6}},
                        { source: "prelungire", "cInputType": "BooleanField", "_tag": "CInput", _id: "check2", resource: "form11_10_181", item: {width: 6}},
                        { source: "schimbare_denumire", "cInputType": "BooleanField", "_tag": "CInput", _id: "check3", resource: "form11_10_181", item: {width: 6}},
                        { source: "schimbare_sediu", "cInputType": "BooleanField", "_tag": "CInput", _id: "check4", resource: "form11_10_181", item: {width: 6}},
                        { source: "renuntare", "cInputType": "BooleanField", "_tag": "CInput", _id: "check5", resource: "form11_10_181", item: {width: 6}},

                    ]
                },
                {
                    "_tag": "CBlock",
                    "_id": "sec6",
                    "cBlockType": "Heading",
                    "title": "Denumiri propuse în ordinea preferințelor solicitantului",
                    box: {
                        spacing: {
                            marginTop: 5,
                        }
                    },
                    item: {width: 12},
                },
                {
                    "_tag": "CLayout",
                    "_id": "Row4",
                    spacing: 3,
                    "box": {
                        "borders": {
                            "border": 1,
                            "borderColor": "text.primary",
                        },
                        spacing: {
                            padding: 2,
                            marginTop: 4,
                        }
                    },
                    "children": [
                        { source: "denumire_1", "cInputType": "TextField", "_tag": "CInput", _id: "denum1", resource: "form11_10_181", item: {width: 12}},
                        { source: "denumire_2", "cInputType": "TextField", "_tag": "CInput", _id: "denum2", resource: "form11_10_181", item: {width: 12}},
                        { source: "denumire_3", "cInputType": "TextField", "_tag": "CInput", _id: "denum3", resource: "form11_10_181", item: {width: 12}},
                    ]
                },                
            ]
        },
        {
            "_tag": "CBlock",
            "_id": "jW9ZraEAL3",
            "cBlockType": "Heading",
            "title": "OPIS DOCUMENTE DEPUSE",
            box: {
                spacing: {
                    marginTop: 5,
                }
            },
            item: {width: 12},
        },
        {
            "_tag": "CList",
            "_id": "lUQUqX",
            "cListType": "Table",
            "resource": "doc11_10_181",
            "labelSource": "id",
            "editable": false,
            "refToParentListFieldName": "form_id",
            "isSubListOf": "form11_10_181",
            "enabledActions": [
                {
                    "actionType": "CREATE"
                }
            ],
            fields: [
                {cInputType: 'NumberField', source: "id", resource: 'doc11_10_181'},
                {cInputType: 'TextField', source: "denumirea_actului", resource: 'doc11_10_181'},
                {cInputType: 'NumberField', source: "nr_file", resource: 'doc11_10_181'},
            ]
        },        
    ]
}