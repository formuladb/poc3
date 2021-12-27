import { setPermission } from "src/core-orm/setPermision"
import { Form11_10_181 } from "./entity/Form11_10_181";

export default async () => {
    await setPermission(conn, 'frmdb_anon', Form11_10_181, true, false, false, false);
}
