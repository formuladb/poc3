
export interface RenderTree {
    id: string;
    name: string;
    category: string;
    children?: RenderTree[];
}

export function createTree(categories: string[]): RenderTree[] {
    let nodes: RenderTree[] = [];
    let nodeStack: RenderTree[] = [{
        id: '',
        name: '',
        category: '',
        children: nodes,
    }];
    for (let categ of categories) {
        let id = categ;
        let name = categ.replace(/^.+\./, '');
        let category = categ.replace(/\.?[^.]+$/, '');
        let node: RenderTree = { id, name, category };

        let parentNode = nodeStack[nodeStack.length - 1];
        while (parentNode.id != '' && category != parentNode.id) {
            if (category.indexOf(`${parentNode.id}.`) === 0) {
                let intermediaryCategories = category.replace(`${parentNode.id}.`, '').split('.');
                for (let categ of intermediaryCategories) {
                    parentNode = nodeStack[nodeStack.length - 1]; 
                    let inode = {
                        id: `${parentNode.id}.${categ}`,
                        name: categ,
                        category: parentNode.id,
                    };
                    if (!parentNode.children) parentNode.children = [];
                    parentNode.children.push(inode);
                    nodeStack.push(inode);
                }
                parentNode = nodeStack[nodeStack.length - 1];    
            } else {
                nodeStack.pop();
                parentNode = nodeStack[nodeStack.length - 1];    
            }
        }

        if (!parentNode.children) parentNode.children = [];
        parentNode.children.push(node);

        nodeStack.push(node);
    }
    return nodes;
}
