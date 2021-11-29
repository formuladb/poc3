import { PrwDictionary } from "@core/entity/PrwDictionary";
import { PrwPage } from "@core/entity/PrwPage";
import { PrwTable } from "@core/entity/PrwTable";
import { autoMigrate } from "src/core-orm/autoMigrate";
import { entityMetadata } from "src/core-orm/entityMetadata";
import { putRow, putRows } from "src/core-orm/putRow";
import { metaColumnsDictionary } from "../../00_base/metaColumnsDictonary";
import { Doc11_10_181 } from "./entity/Doc11_10_181";
import { Form11_10_181 } from "./entity/Form11_10_181";
import { form11_10_181__id } from "./form11_10_181__id";

export default async () => {
    await autoMigrate(Form11_10_181);
    await autoMigrate(Doc11_10_181);

    const res1 = await putRow(PrwTable, 
        { id: entityMetadata(Form11_10_181).tableName, idType: "serial NOT NULL", parent: "onrc", icon: "material-design-icons-dynamic_form", resource_type: "RESOURCE", menu_order: 0 });

    await putRows(PrwTable, [
        { id: "onrc", icon: "material-design-icons-list", idType: "n/a", resource_type: "GROUP", menu_order: 5 },
        { id: entityMetadata(Doc11_10_181).tableName, idType: "serial NOT NULL", parent: "_hidden_", icon: "material-design-icons-dynamic_form", resource_type: "RESOURCE", menu_order: 0 },
    ]);

    await putRows(PrwPage, [
        { id: "form11_10_181__id", content: form11_10_181__id, prwTable: res1 },
    ]);

    // Diacritice (ă â î ș ț) (Ă Â Î Ș Ț)
    let tblName = entityMetadata(Form11_10_181).tableName;
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

    tblName = entityMetadata(Doc11_10_181).tableName;
    await putRows(PrwDictionary, [
        { id: `resources.${tblName}.name`,  en: 'Documents 11-10-181', ro: 'Documente 11-10-181'},
        { id: `resources.${tblName}.fields.id`,  en: 'Id', ro: 'Id'},
        { id: `resources.${tblName}.fields.denumirea_actului`,  en: 'Document Name', ro: 'Denumirea Actului'},
        { id: `resources.${tblName}.fields.nr_file`,  en: 'Nb Pages', ro: 'Nr File'},

        ...metaColumnsDictionary(tblName),
    ]);
}
