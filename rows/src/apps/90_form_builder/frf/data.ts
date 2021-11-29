import { PrwDictionary } from "@core/entity/PrwDictionary";
import { PrwPage } from "@core/entity/PrwPage";
import { PrwTable } from "@core/entity/PrwTable";
import { autoMigrate } from "src/core-orm/autoMigrate";
import { entityMetadata } from "src/core-orm/entityMetadata";
import { putRow, putRows } from "src/core-orm/putRow";
import { setPermission } from "src/core-orm/setPermision";
import { metaColumnsDictionary } from "../../00_base/metaColumnsDictonary";
import { Isf } from "./entity/Isf";
import { Playfield } from "./entity/Playfield";
import { isf__id } from "./isf__id";

export default async () => {
    await autoMigrate(Isf);
    await autoMigrate(Playfield);

    const res1 = await putRow(PrwTable, 
        { id: entityMetadata(Isf).tableName, idType: "serial NOT NULL", parent: "frf", icon: "material-design-icons-sports_soccer", resource_type: "RESOURCE", menu_order: 0 });//, options: {frmdb_anon: {layoutType: "ONE_PAGE"}}

    await putRows(PrwTable, [
        { id: "frf", icon: "material-design-icons-map", idType: "n/a", resource_type: "GROUP", menu_order: 91 },
        { id: entityMetadata(Playfield).tableName, idType: "serial NOT NULL", parent: "_hidden_", icon: "tbd", resource_type: "RESOURCE", menu_order: 1 },
    ]);

    await putRows(PrwPage, [
        { id: "isf__id", content: isf__id, prwTable: res1 },
    ]);

    let tblName = entityMetadata(Isf).tableName;
    await putRows(PrwDictionary, [
        { id: `resources.frf.name`,  en: 'FRF Forms', ro: 'Formulare FRF'},
        { id: `resources.${tblName}.fields.id`,  en: 'Id', ro: 'Id'},
        { id: `resources.${tblName}.name`,  en: 'Soccer Map', ro: 'Harta Fotbalului'},

        { id: `resources.${tblName}.fields.nume`, en: 'nume', ro: 'Nume'},
        { id: `resources.${tblName}.fields.prenume`, en: 'prenume', ro: 'Prenume'},
        { id: `resources.${tblName}.fields.telefon`, en: 'telefon', ro: 'Telefon'},
        { id: `resources.${tblName}.fields.email`, en: 'email', ro: 'Email'},
        { id: `resources.${tblName}.fields.judet_club`, en: 'judet_club', ro: 'Judet Club'},
        { id: `resources.${tblName}.fields.localitate_club`, en: 'localitate_club', ro: 'Localitate Club'},
        { id: `resources.${tblName}.fields.denumire_club`, en: 'denumire_club', ro: 'Denumire Club'},
        { id: `resources.${tblName}.fields.nr_identificare_club`, en: 'nr_identificare_club', ro: 'Nr Identificare Club'},
        { id: `resources.${tblName}.fields.logo`, en: 'logo', ro: 'Logo'},
        { id: `resources.${tblName}.fields.iagine1`, en: 'iagine1', ro: 'Imagine 1'},
        { id: `resources.${tblName}.fields.iagine2`, en: 'iagine2', ro: 'Imagine 2'},
        { id: `resources.${tblName}.fields.iagine3`, en: 'iagine3', ro: 'Imagine 3'},
        { id: `resources.${tblName}.fields.iagine4`, en: 'iagine4', ro: 'Imagine 4'},
        { id: `resources.${tblName}.fields.iagine5`, en: 'iagine5', ro: 'Imagine 5'},
        ...metaColumnsDictionary(tblName),
    ]);

    tblName = entityMetadata(Playfield).tableName;
    await putRows(PrwDictionary, [
        { id: `resources.${tblName}.fields.id`,  en: 'Id', ro: 'Id'},
        { id: `resources.${tblName}.name`,  en: 'Playfield', ro: 'Teren'},
        { id: `resources.playfield.fields.nume`, en: "nume", ro: "Nume"},
        { id: `resources.playfield.fields.localitate`, en: "localitate", ro: "Localitate"},
        { id: `resources.playfield.fields.strada`, en: "strada", ro: "Strada"},
        { id: `resources.playfield.fields.nr_teren`, en: "nr_teren", ro: "Nr Teren"},
        { id: `resources.playfield.fields.cod_postal`, en: "cod_postal", ro: "Cod Postal"},

        ...metaColumnsDictionary(tblName),
    ]);

    await setPermission('frmdb_anon', Isf, true, true, true, false);
    await setPermission('frmdb_anon', Playfield, true, true, true, false);
}
