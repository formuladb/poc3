
import { setPermission } from "src/core-orm/setPermision"
import { Page } from "./entity/Page";
import { Section, SubSection } from "./entity/Section";

export default async () => {
    setPermission('administrator', 'ALL-TABLES', true, true, true, true);

    setPermission('frmdb_anon', Page, true, false, false, false);
    setPermission('frmdb_anon', Section, true, false, false, false);
    setPermission('frmdb_anon', SubSection, true, false, false, false);

}
