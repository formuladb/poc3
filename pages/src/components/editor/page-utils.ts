import { SerializedNode } from '@craftjs/core';
import { PageNodeMetadata, PageNode, isCanvasNode } from '../../core/entity/page';
import { omitProps } from '../utils';

export function mapToTree(parentId: string, parentNode: SerializedNode, nodes: Record<string, SerializedNode>): PageNode {
    let ret: PageNode = {
        _tag: (typeof parentNode.type === "string" ? parentNode.type : parentNode.type.resolvedName) as PageNode['_tag'],
        _id: parentId,
        ...parentNode.props,
    };

    for (let childNodeId of parentNode.nodes||[]) {
        let node = nodes[childNodeId];
        if (!isCanvasNode(ret)) throw new Error(`Node ${ret._tag}/${ret._id} cannot have children ${childNodeId}/${JSON.stringify(node)}`);
        let nodeAsTree = mapToTree(childNodeId, node, nodes);
        ret.children = ret.children || [];
        ret.children.push(nodeAsTree);    
    }

    return ret;
}

export function mapFromTree(parentId: undefined | string, rootNode: PageNode, nodes: Record<string, SerializedNode>) {
    const cmpMeta = PageNodeMetadata[rootNode._tag];
    if (!cmpMeta) throw new Error(`Unknown components ${rootNode._tag}, ${rootNode._id}`);

    nodes[rootNode._id] = {
        type: {
            resolvedName: rootNode._tag,
        },
        props: isCanvasNode(rootNode) ? omitProps(rootNode, ['_id', '_tag', 'children']) : omitProps(rootNode, ['_id', '_tag']),
        nodes: isCanvasNode(rootNode) && rootNode.children ? rootNode.children.map(n => n._id) : [],
        displayName: cmpMeta.displayName,
        isCanvas: cmpMeta.isCanvas,
        custom: {},
        hidden: false,
        linkedNodes: {},
        parent: parentId!,
    };

    if (isCanvasNode(rootNode)) {
        for (let node of (rootNode.children || [])) {
            mapFromTree(rootNode._id, node, nodes);
        }
    }

    return nodes;
}
