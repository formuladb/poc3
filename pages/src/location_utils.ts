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
            parsedPath.push({resourceName, resourceId: segment === "create" ? undefined : segment});
            resourceName = null;
        }
    }

    if (!firstId && resourceName) {
        parsedPath.push({resourceName});
    }

    const resource = parsedPath[0]?.resourceName || 'frmdb_dashboard';
    let pageId = resource + (firstId ? '__id' : '');

    return {pageId, resource, parsedPath};
}
