import { CPageNode } from '@core/entity/page';

export const isf__id: CPageNode = {
    "_tag": "CPage",
    "_id": "ROOT",
    "cPageType": "Edit",
    "children": [
        {
            "_tag": "CForm",
            "_id": "Ek4N5ig9v",
            "resource": "isf",
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
                            "_id": "t2.1",
                            "cElementType": "Text",
                            "content": "Date despre persoana care completează formularul.",
                            item: { width: 12 },
                        },
                        {
                            "_tag": "CElement",
                            "_id": "t2.2",
                            "cElementType": "Text",
                            "content": "Aceste date nu vor fi făcute publice și sunt colectate strict pentru a facilita legătura între FRF și persoana respectivă.",
                            item: { width: 12 },
                        },
                        {
                            "_tag": "CElement",
                            "_id": "ic2.1",
                            "cElementType": "Icon",
                            name: "material-design-icons-account_circle",
                            item: { width: 1 },
                        },
                        {
                            "_tag": "CInput",
                            "_id": "in2.1",
                            "cInputType": "TextField",
                            "resource": "isf",
                            "source": "nume",
                            "variant": "standard",
                            "disabled": false,
                            item: { width: 5 },
                        },
                        {
                            "_tag": "CElement",
                            "_id": "ic2.2",
                            "cElementType": "Icon",
                            name: "material-design-icons-account_circle",
                            item: { width: 1 },
                        },
                        {
                            "_tag": "CInput",
                            "_id": "in2.2",
                            "cInputType": "TextField",
                            "resource": "isf",
                            "source": "prenume",
                            "variant": "standard",
                            "disabled": false,
                            item: { width: 5 },
                        },
                        {
                            "_tag": "CElement",
                            "_id": "ic2.3",
                            "cElementType": "Icon",
                            name: "material-design-icons-phone",
                            item: { width: 1 },
                        },
                        {
                            "_tag": "CInput",
                            "_id": "in2.3",
                            "cInputType": "TextField",
                            "resource": "isf",
                            "source": "telefon",
                            "variant": "standard",
                            "disabled": false,
                            item: { width: 5 },
                        },
                        {
                            "_tag": "CElement",
                            "_id": "ic2.4",
                            "cElementType": "Icon",
                            name: "material-design-icons-email",
                            item: { width: 1 },
                        },
                        {
                            "_tag": "CInput",
                            "_id": "in2.4",
                            "cInputType": "TextField",
                            "resource": "isf",
                            "source": "email",
                            "variant": "standard",
                            "disabled": false,
                            item: { width: 5 },
                        },
                    ]
                },
                {
                    "_tag": "CLayout",
                    "_id": "Row3",
                    spacing: 3,
                    box: {
                        spacing: {
                            paddingTop: 5,
                        }
                    },
                    "children": [
                        {
                            "_tag": "CElement",
                            "_id": "t3.2",
                            "cElementType": "Text",
                            "content": "DATE despre clubul pe care il reprezinti.",
                            item: { width: 12 },
                        },
                        {
                            "_tag": "CElement",
                            "_id": "t3.3",
                            "cElementType": "Text",
                            "content": "Răspunsurile de la întrebările 1,2,3,4,5,6,9,10,11,12,13,14,15,16,17,18,19,20,21 vor fi făcute publice pentru a crește expunerea clubului tău. Excepție fac datele introduse la întrebările 7 și 8, pentru care îți oferim opțiunea de a nu le face publice în cazul în care nu dorești acest lucru.",
                            item: { width: 12 },
                        },
                        {
                            "_tag": "CElement",
                            "_id": "t3.4",
                            "cElementType": "Text",
                            "content": "1) Care este județul de care aparține clubul tău? *",
                            item: { width: 4 },
                        },
                        {
                            "_tag": "CElement",
                            "_id": "t3.5",
                            "cElementType": "Text",
                            "content": " ",
                            item: { width: 1 },
                        },
                        {
                            "_tag": "CInput",
                            "_id": "in3.1",
                            "cInputType": "TextField",
                            "resource": "isf",
                            "source": "judet_club",
                            "variant": "standard",
                            "disabled": false,
                            item: { width: 7 },
                        },
                        {
                            "_tag": "CElement",
                            "_id": "t3.6",
                            "cElementType": "Text",
                            "content": "2) Din ce localitate provine clubul tău? *",
                            item: { width: 4 },
                        },
                        {
                            "_tag": "CElement",
                            "_id": "t3.7",
                            "cElementType": "Text",
                            "content": " ",
                            item: { width: 1 },
                        },
                        {
                            "_tag": "CInput",
                            "_id": "in3.2",
                            "cInputType": "TextField",
                            "resource": "isf",
                            "source": "localitate_club",
                            "variant": "standard",
                            "disabled": false,
                            item: { width: 7 },
                        },
                        {
                            "_tag": "CElement",
                            "_id": "t3.3.1",
                            "cElementType": "Text",
                            "content": "3) Care este denumirea completă a clubului tău? : *",
                            item: { width: 4 },
                        },
                        {
                            "_tag": "CElement",
                            "_id": "ic3.3",
                            "cElementType": "Icon",
                            "name": "material-design-icons-sports_soccer",
                            item: { width: 1 },
                        },
                        {
                            "_tag": "CInput",
                            "_id": "in3.3",
                            "cInputType": "TextField",
                            "resource": "isf",
                            "source": "denumire_club",
                            "variant": "standard",
                            "disabled": false,
                            item: { width: 7 },
                        },
                    ]
                },                                
            ]
        }
    ]
}