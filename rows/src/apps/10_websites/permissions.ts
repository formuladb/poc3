
import { setPermission } from "src/core-orm/setPermision"
import { StaticPage } from "./entity/StaticPage";
import { Section, SubSection } from "./entity/Section";

export default async () => {
    
    await setPermission(conn, 'frmdb_anon', StaticPage, true, false, false, false);
    await setPermission(conn, 'frmdb_anon', Section, true, false, false, false);
    await setPermission(conn, 'frmdb_anon', SubSection, true, false, false, false);

}
