import { STATIC_PAGES_TABLE } from "./core/entity/PrwPage";

export interface PageData {
    pageId: string;
    resource: string;
    parsedPath: {resourceName: string, resourceId?: string}[];
}
export function parseLocation(pathname: string): PageData {
    let parsedPath: PageData['parsedPath'] = [];
    let resourceName: string | null = null;
    let firstId: string | null = null;
    for (let segment of pathname.replace(/^\//, '').split('/')) {
        if (null == resourceName) {
            resourceName = segment;
        } else {
            if (!firstId) firstId = segment;
            let resourceId = segment === "create" ? undefined : segment;
            parsedPath.push({resourceName, resourceId});
            resourceName = null;
        }
    }

    if (!firstId && resourceName) {
        parsedPath.push({resourceName});
    }

    const resource = parsedPath[0]?.resourceName || 'frmdb_homepage';
    let pageId = resource + (firstId ? '__id' : '');
    if (STATIC_PAGES_TABLE === resource && firstId) {
        pageId = resource + '__' + firstId;
    }

    return {pageId, resource, parsedPath};
}
