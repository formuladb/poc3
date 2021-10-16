import { CPageNode } from '@core/entity/page';

export const isf__id: CPageNode = {
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
                    "_id": "Row1",
                    spacing: 3,
                    "children": [
                        {
                            "_tag": "CBlock",
                            "_id": "jW9ZraEAL2",
                            "cBlockType": "Heading",
                            "title": "Hai pe harta fotbalului românesc!",
                            "subtitle": "Ia-ți 5 minute, completează formularul și noi te punem pe hartă.",
                            body: "Te rugăm să completezi cu atenție fiecare câmp pentru a oferi informații corecte celor care vor să afle mai multe despre clubul tău.",
                            item: { width: 12 },
                        },
                        {
                            "_tag": "CElement",
                            "_id": "3Ubid",
                            "cElementType": "Text",
                            "content": "Câmpurile marcate cu * sunt obligatorii.",
                            item: { width: 12 },
                        },
                    ]
                },
                {
                    "_tag": "CLayout",
                    "_id": "Row2",
                    spacing: 3,
                    "children": [
                        {
                            "_tag": "CElement",
                            "_id": "3Ubi2",
                            "cElementType": "Text",
                            "content": "Date despre persoana care completează formularul.",
                            item: { width: 12 },
                        },
                        {
                            "_tag": "CElement",
                            "_id": "3Ubi2",
                            "cElementType": "Text",
                            "content": "Aceste date nu vor fi făcute publice și sunt colectate strict pentru a facilita legătura între FRF și persoana respectivă.",
                            item: { width: 12 },
                        },
                        {
                            "_tag": "CElement",
                            "_id": "3Ubi2",
                            "cElementType": "Icon",
                            name: "material-design-icons-account_circle",
                            item: { width: 1 },
                        },
                        {
                            "_tag": "CInput",
                            "_id": "i1",
                            "cInputType": "TextField",
                            "resource": "isf",
                            "source": "nume",
                            "variant": "standard",
                            "disabled": false
                        }
                    ]
                },                
            ]
        }
    ]
}