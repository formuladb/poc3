
import { setPermission } from "src/core-orm/setPermision"
import { Page } from "./entity/Page";
import { Section, SubSection } from "./entity/Section";

export default async () => {
    
    await setPermission('frmdb_anon', Page, true, false, false, false);
    await setPermission('frmdb_anon', Section, true, false, false, false);
    await setPermission('frmdb_anon', SubSection, true, false, false, false);

}
