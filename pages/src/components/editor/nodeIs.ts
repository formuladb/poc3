import { Node as CraftNode, useEditorReturnType } from '@craftjs/core';

export function nodeIs(node: CraftNode, query: useEditorReturnType['query']) {
    return {
        active: node.events.selected,
        hover: node.events.hovered,
        dom: node.dom,
        name: node.data.custom.displayName || node.data.displayName,
        moveable: query.node(node.id).isDraggable(),
        deletable: query.node(node.id).isDeletable(),
        parent: node.data.parent,
        props: node.data.props,
    };
}
export type NodeIsT = ReturnType<typeof nodeIs>;