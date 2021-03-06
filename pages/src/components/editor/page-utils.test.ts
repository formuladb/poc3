import { ROOT_NODE, SerializedNode } from '@craftjs/core';
import { PageNode } from '../../core/entity/page';
import { mapToTree, mapFromTree } from './page-utils';

test('should convert to/from tree', () => {
    let pageAsTree = mapToTree(ROOT_NODE, TestPage.ROOT as SerializedNode, TestPage);
    expect(pageAsTree).toEqual(TestPageAsTree);

    let backToDictionary: Record<string, SerializedNode> = {}
    mapFromTree(undefined, TestPageAsTree, backToDictionary);
    expect(backToDictionary).toEqual(TestPage);
});

//##################################################################################
//##################################################################################
// TestPageAsTree
//##################################################################################
//##################################################################################

const TestPageAsTree: PageNode = {
    _tag: "CPage",
    cPageType: "Edit",
    _id: "ROOT",
    children: [
        {
            _tag: "CForm",
            _id: "-sDe2Olwr",
            resource: "some-resource",
            children: [
                {
                    _tag: "CLayout",
                    _id: "s0To1_oLI",
                    children: [
                        {
                            _tag: "CInput",
                            _id: "UC0s4-8gM",
                            resource: "service_forms",
                            source: "id",
                            variant: "standard",
                            disabled: true,
                            cInputType: "NumberField"
                        },
                        {
                            _tag: "CInput",
                            _id: "sXBXJ7ClL",
                            resource: "service_forms",
                            source: "time_of_arival",
                            variant: "standard",
                            disabled: false,
                            cInputType: "DateTimeField"
                        },
                    ]
                },
                {
                    _tag: "CLayout",
                    _id: "PZDQ-bBtC",
                },
            ],
        },
    ]
};

//##################################################################################
//##################################################################################
// TestPage
//##################################################################################
//##################################################################################
const TestPage = {
    ROOT: {
        type: {
            resolvedName: "CPage"
        },
        isCanvas: true,
        props: {
            background: "#ffffff",
            padding: 1
        },
        displayName: "Paper",
        custom: {},
        hidden: false,
        nodes: [
            "-sDe2Olwr",
        ],
        linkedNodes: {},
    } as SerializedNode,
    "-sDe2Olwr": {
        type: {
            resolvedName: "CForm"
        },
        isCanvas: true,
        props: {
            resource: "some-resource"
        },
        displayName: "Form",
        custom: {},
        hidden: false,
        nodes: [
            "s0To1_oLI",
            "PZDQ-bBtC"
        ],
        linkedNodes: {},
        parent: "ROOT"
    },
    "UC0s4-8gM": {
        type: {
            resolvedName: "CInput"
        },
        isCanvas: false,
        props: {
            resource: "service_forms",
            source: "id",
            variant: "standard",
            disabled: true,
            cInputType: "NumberField"
        },
        displayName: "Input",
        custom: {},
        hidden: false,
        nodes: [],
        linkedNodes: {},
        parent: "s0To1_oLI"
    },
    sXBXJ7ClL: {
        type: {
            resolvedName: "CInput"
        },
        isCanvas: false,
        props: {
            resource: "service_forms",
            source: "time_of_arival",
            variant: "standard",
            disabled: false,
            cInputType: "DateTimeField"
        },
        displayName: "Input",
        custom: {},
        hidden: false,
        nodes: [],
        linkedNodes: {},
        parent: "s0To1_oLI"
    },
    s0To1_oLI: {
        type: {
            resolvedName: "CLayout"
        },
        isCanvas: true,
        props: {
            padding: 2
        },
        displayName: "Row",
        custom: {},
        hidden: false,
        nodes: [
            "UC0s4-8gM",
            "sXBXJ7ClL",
        ],
        linkedNodes: {},
        parent: "-sDe2Olwr"
    },

    "PZDQ-bBtC": {
        type: {
            resolvedName: "CLayout"
        },
        isCanvas: true,
        props: {
            background: "#ffffff",
            padding: 2
        },
        displayName: "Row",
        custom: {},
        hidden: false,
        nodes: [],
        linkedNodes: {},
        parent: "-sDe2Olwr"
    },
};
