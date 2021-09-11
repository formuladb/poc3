import { RecordMap } from "react-admin";
import { DEFAULT_FILTER_TREE_COLS } from "../core/entity/fields";
import { FrmdbResource, FrmdbResourceWithFields } from "../core/entity/FrmdbResource";
import { PageNode } from "../core-domain/page";

export function defaultListPageContent(
    resourceWithFields: FrmdbResourceWithFields,
    resourceList: RecordMap<FrmdbResource>
): PageNode {
    const resource = resourceWithFields.id;
    let filterTreeResource: undefined | string = undefined, filterTreeField: undefined | string = undefined;
    for (let fieldDef of resourceWithFields.field_defs) {
        if (DEFAULT_FILTER_TREE_COLS.includes(fieldDef.name)) {
            let categTable = Object.values(resourceList)
                .find(res => res.id == `${resource}__${fieldDef.name}`);
            if (categTable) {
                filterTreeResource = categTable.id;
                filterTreeField = fieldDef.name;
                break;
            }
        }
    }

    return {
        _id: "ROOT",
        _tag: "CPage",
        cPageType: "List",
        filterTreeResource,
        filterTreeField,
        enabledActions: [
            {actionType: 'CREATE'},
            {actionType: 'EXPORT'},
        ],
        children: [
            {
                _tag: "CList",
                _id: "6O2nIKQYAg",
                cListType: "Table",
                resource: resource,
                labelSource: "id",
                editable: true,
            },
        ]
    };
}
