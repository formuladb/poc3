import { PrwDictionary } from "@core/entity/PrwDictionary";
import { PrwPage } from "@core/entity/PrwPage";
import { PrwTable } from "@core/entity/PrwTable";
import { autoMigrate } from "src/core-orm/autoMigrate";
import { entityMetadata } from "src/core-orm/entityMetadata";
import { putRow, putRows } from "src/core-orm/putRow";
import { setPermission } from "src/core-orm/setPermision";
import { metaColumnsDictionary } from "../base/metaColumnsDictonary";
import { Isf } from "./entity/Isf";
import { isf__id } from "./isf";

export default async () => {
    await autoMigrate(Isf);

    const res1 = await putRow(PrwTable, 
        { id: entityMetadata(Isf).tableName, parent: "frf", icon: "material-design-icons-sports_soccer", resource_type: "RESOURCE", menu_order: 0 });

    await putRows(PrwTable, [
        { id: "frf", icon: "material-design-icons-map", resource_type: "GROUP", menu_order: 6 },
    ]);

    await putRows(PrwPage, [
        { id: "isf__id", content: isf__id, prwTable: res1 },
    ]);

    let tblName = entityMetadata(Isf).tableName;
    await putRows(PrwDictionary, [
        { id: `resources.onrc.name`,  en: 'ONRC Forms', ro: 'Formulare ONRC'},
        { id: `resources.${tblName}.fields.id`,  en: 'Id', ro: 'Id'},
        { id: `resources.${tblName}.name`,  en: 'Form 11-10-181', ro: 'Formular 11-10-181'},
        { id: `resources.${tblName}.fields.tribunal`,  en: 'Court', ro: 'Tribunal'},

        { id: `resources.${tblName}.fields.subsemnat_nume`, en: 'nam', ro: 'nume'},
        { id: `resources.${tblName}.fields.subsemnat_domiciliat_in`, en: 'living in', ro: 'domiciliat_in'},
        { id: `resources.${tblName}.fields.subsemnat_str`, en: 'street', ro: 'str'},
        { id: `resources.${tblName}.fields.subsemnat_nr`, en: 'No.', ro: 'nr'},
        { id: `resources.${tblName}.fields.subsemnat_bloc`, en: 'block', ro: 'bloc'},
        { id: `resources.${tblName}.fields.subsemnat_scara`, en: 'scale', ro: 'scara'},
        { id: `resources.${tblName}.fields.subsemnat_etaj`, en: 'floor', ro: 'etaj'},
        { id: `resources.${tblName}.fields.subsemnat_apartament`, en: 'apartment', ro: 'apartament'},

        { id: `resources.${tblName}.fields.autorizare`, en: 'authorization of incorporation and registration', ro: 'autorizare constituire şi înmatriculare'},
        { id: `resources.${tblName}.fields.prelungire`, en: 'company name reservation extension', ro: 'prelungire rezervare denumire firmă'},
        { id: `resources.${tblName}.fields.schimbare_denumire`, en: 'name change', ro: 'schimbare denumire'},
        { id: `resources.${tblName}.fields.schimbare_sediu`, en: 'change of headquarters from / to another county', ro: 'schimbare sediu din/în alt judeţ'},
        { id: `resources.${tblName}.fields.renuntare`, en: 'Give up the facility', ro: 'Renunțare la facilitate'},
        
        { id: `resources.${tblName}.fields.denumire_1`, en: 'name', ro: 'nume' },
        { id: `resources.${tblName}.fields.denumire_2`, en: 'name', ro: 'nume' },
        { id: `resources.${tblName}.fields.denumire_3`, en: 'name', ro: 'nume' },

        ...metaColumnsDictionary(tblName),
    ]);


    await setPermission('frmdb_anon', Isf, true, true, true, false);
}
