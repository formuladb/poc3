import { BoxProps, TypographyProps } from "./styles";

export interface FormulaInUI {
    expression: string;
}
export interface PageNodeBase {
    readonly _tag: string;
    _id: string;
};

interface CPageNodeBase extends PageNodeBase {
    '$schema'?: string;
    children?: PageNode[];
}
export interface CPageEditProps {
    cPageType: 'Edit';
}
export interface CPageEditNode extends CPageNodeBase, CPageEditProps {
    _tag: 'CPage';
}
export interface CPageCreateProps {
    cPageType: 'Create';
}
export interface CPageCreateNode extends CPageNodeBase, CPageEditProps {
    _tag: 'CPage';
}
export interface CPageListProps {
    cPageType: 'List';
    /**@TJS-format frmdb-category-resource-name */
    filterTreeResource?: string;
    /**@TJS-format frmdb-category-field-name */
    filterTreeField?: string;
    enabledActions?: ListAction[];
    noFilters?: boolean;
    noPagination?: boolean;
    largePages?: boolean;

}
export interface CPageListNode extends CPageNodeBase, CPageListProps {
    _tag: 'CPage';
}

export type CPageProps = CPageEditProps | CPageCreateProps | CPageListProps;
export type CPageNode = CPageEditNode | CPageCreateNode | CPageListNode;

export interface CListPropsBase {
    /**@TJS-format frmdb-resource-name */
    resource: string;
    /**@TJS-format frmdb-resource-field-name */
    labelSource: string;
    fields?: CInputProps[];
    editable?: boolean;
    /**@TJS-format frmdb-resource-name */
    isSubListOf?: string;
    /**@TJS-format frmdb-resource-field-name */
    refToParentListFieldName?: string;

    /**@TJS-format frmdb-multiple-choice */
    enabledActions?: ListAction[];

    formActions?: FormAction[];

    /**@TJS-format frmdb-resource-field-name */
    sortField?: string;
    sortOrder?: 'ASC' | 'DESC';
}

export interface CListTabsProps extends CListPropsBase {
    cListType: 'Tabs';
}
export interface CListTabsNode extends PageNodeBase, CListTabsProps {
    _tag: 'CList';
    children?: PageNode[];
}

export interface CListTableProps extends CListPropsBase {
    cListType: 'Table';
}
export interface CListTableNode extends PageNodeBase, CListTableProps {
    _tag: 'CList';
    children?: PageNode[];
}


export interface CListDatagridProps extends CListPropsBase {
    cListType: 'Datagrid';
}
export interface CListDatagridNode extends PageNodeBase, CListDatagridProps {
    _tag: 'CList';
    children?: PageNode[];
}

export interface CListFormListProps extends CListPropsBase {
    cListType: 'FormList';
}
export interface CListFormListNode extends PageNodeBase, CListFormListProps {
    _tag: 'CList';
    children?: PageNode[];
}


export interface CListChartProps extends CListPropsBase {
    cListType: 'Chart';
    chartType: "Line" | "Bar" | "Pie";
    /**@TJS-format frmdb-resource-field-name */
    xAxisSource: string;

    /**@TJS-format frmdb-resource-field-name */
    yAxisSource: string;
    /**@TJS-format frmdb-resource-field-name */
    pivotYAxisSource?: string;

    /**@TJS-format frmdb-resource-field-name */
    yAxisSource2?: string;
    /**@TJS-format frmdb-resource-field-name */
    yAxisSource3?: string;
    /**@TJS-format frmdb-resource-field-name */
    yAxisSource4?: string;
}
export interface CListChartNode extends PageNodeBase, CListChartProps {
    _tag: 'CList';
    children?: PageNode[];
}

export type CListProps =
    | CListTabsProps
    | CListTableProps
    | CListDatagridProps
    | CListFormListProps
    | CListChartProps
    ;
export type CListNode =
    | CListTabsNode
    | CListTableNode
    | CListDatagridNode
    | CListFormListNode
    | CListChartNode
    ;

interface ActionCREATE {
    actionType: 'CREATE';
}
export interface ActionEXPORT {
    actionType: 'EXPORT';
}
export interface ActionIMPORTDATA {
    actionType: 'IMPORTDATA';
    fieldMappings: { importedField: string, field: string }[];
}

export interface ActionPRINT {
    actionType: 'PRINT';
}


export type ListAction =
    | ActionCREATE
    | ActionEXPORT
    | ActionIMPORTDATA
    | ActionPRINT
    ;


export interface ActionSET {
    actionType: 'SET';
    source: string;
    value: string | number;
}

export interface ActionREDIRECT {
    actionType: 'REDIRECT';
    redirectNextSibling?: boolean;
    to: 'LIST' | {
        resource: string;
        referenceField: string;
    }
}

export interface ActionSAVE {
    actionType: 'SAVE';
    label?: string;
    extraActions: (ActionSET | ActionREDIRECT)[];
}
export interface ActionDELETE {
    actionType: 'DELETE';
    disabled?: boolean;
}

export type FormAction =
    | ActionPRINT
    | ActionSAVE
    | ActionDELETE
    ;


interface GridItemProps {
    width?: 1 | 2 | 3 | 4 | 6 | 8 | 10 | 12;
}

interface CInputPropsBase {
    /**@TJS-format frmdb-resource-name */
    resource: string;
    /**@TJS-format frmdb-resource-field-name */
    source: string;

    variant?: 'standard' | 'filled' | 'outlined';
    size?: 'small';
    disabled?: boolean;

    box?: BoxProps;
    item?: GridItemProps;
}

/**@TJS-title TextField */
export interface CInputTextFieldProps extends CInputPropsBase {
    cInputType: "TextField";
    multiline?: boolean;
    initialValue?: string;
}
export interface CInputTextFieldNode extends PageNodeBase, CInputTextFieldProps {
    _tag: "CInput";
}

export interface CInputBooleanFieldProps extends CInputPropsBase {
    cInputType: "BooleanField";
    initialValue?: boolean;
}
export interface CInputBooleanFieldNode extends PageNodeBase, CInputBooleanFieldProps {
    _tag: "CInput";
}
export interface CInputChipFieldProps extends CInputPropsBase {
    cInputType: "ChipField";
}
export interface CInputChipFieldNode extends PageNodeBase, CInputChipFieldProps {
    _tag: "CInput";
}
export interface CInputDateFieldProps extends CInputPropsBase {
    cInputType: "DateField";
    initialValue?: Date | "CURRENT_DATE";
}
export interface CInputDateFieldNode extends PageNodeBase, CInputDateFieldProps {
    _tag: "CInput";
}
export interface CInputDateTimeFieldProps extends CInputPropsBase {
    cInputType: "DateTimeField";
    initialValue?: Date | "CURRENT_DATE_TIME";
}
export interface CInputDateTimeFieldNode extends PageNodeBase, CInputDateTimeFieldProps {
    _tag: "CInput";
}
export interface CInputEmailFieldProps extends CInputPropsBase {
    cInputType: "EmailField";
}
export interface CInputEmailFieldNode extends PageNodeBase, CInputEmailFieldProps {
    _tag: "CInput";
}
export interface CInputImageFieldProps extends CInputPropsBase {
    cInputType: "ImageField";
}
export interface CInputImageFieldNode extends PageNodeBase, CInputImageFieldProps {
    _tag: "CInput";
}
export interface CInputFileFieldProps extends CInputPropsBase {
    cInputType: "FileField";
}
export interface CInputFileFieldNode extends PageNodeBase, CInputFileFieldProps {
    _tag: "CInput";
}
export interface CInputNumberFieldProps extends CInputPropsBase {
    cInputType: "NumberField";
    initialValue?: number;
}
export interface CInputNumberFieldNode extends PageNodeBase, CInputNumberFieldProps {
    _tag: "CInput";
}
export interface CInputRichTextFieldProps extends CInputPropsBase {
    readonly cInputType: "RichTextField";
    initialValue?: string;
}
export interface CInputRichTextFieldNode extends PageNodeBase, CInputRichTextFieldProps {
    _tag: "CInput";
}
export interface CInputUrlFieldProps extends CInputPropsBase {
    cInputType: "UrlField";
}
export interface CInputUrlFieldNode extends PageNodeBase, CInputUrlFieldProps {
    _tag: "CInput";
}
export interface CInputIntervalFieldProps extends CInputPropsBase {
    cInputType: "IntervalField";
}
export interface CInputIntervalFieldNode extends PageNodeBase, CInputIntervalFieldProps {
    _tag: "CInput";
}
export interface CInputJsonProps extends CInputPropsBase {
    cInputType: "Json";
}
export interface CInputJsonNode extends PageNodeBase, CInputJsonProps {
    _tag: "CInput";
}

export interface CInputSelectProps extends CInputPropsBase {
    cInputType: "Select";
    choices: string[];
    initialValue?: string;
    translate?: "yes" | "no";
}
export interface CInputSelectNode extends PageNodeBase, CInputSelectProps {
    _tag: 'CInput';
}
export interface CInputReferenceProps extends CInputPropsBase {
    cInputType: "Reference";
    /**@TJS-format frmdb-reference-resource-name */
    reference: string;
    /**@TJS-format frmdb-reference-field-name */
    referenceText?: string;
    initialValue?: "CURRENT_USER_ID" | "CURRENT_ROLE_ID";
    referenceInputType?: "autocomplete" | "radio_button";
    layout?: "single_row";
    /**@TJS-format frmdb-reference-matching-field-name */
    matchingColumn?: string;
    /**@TJS-format frmdb-reference-field-name */
    sortField?: string;
    sortOrder?: 'ASC' | 'DESC';
}
export interface CInputReferenceNode extends PageNodeBase, CInputReferenceProps {
    _tag: 'CInput';
}

export interface CInputLookupProps extends CInputPropsBase {
    cInputType: "Lookup";
    referenceField: string;
    referenceText: string;
}
export interface CInputLookupNode extends PageNodeBase, CInputLookupProps {
    _tag: 'CInput';
}


export interface CInputFormulaProps extends CInputPropsBase {
    cInputType: "Formula";
    formula: string;
    field: CInputPropsNoFormulas;
}
export interface CInputFormulaNode extends PageNodeBase, CInputFormulaProps {
    _tag: 'CInput';
}


export type CInputPropsNoFormulas =
    | CInputTextFieldProps
    | CInputBooleanFieldProps
    | CInputChipFieldProps
    | CInputDateFieldProps
    | CInputDateTimeFieldProps
    | CInputEmailFieldProps
    | CInputImageFieldProps
    | CInputFileFieldProps
    | CInputNumberFieldProps
    | CInputRichTextFieldProps
    | CInputUrlFieldProps
    | CInputIntervalFieldProps
    | CInputJsonProps
    | CInputSelectProps
    | CInputReferenceProps
    | CInputLookupProps
    ;

export type CInputProps =
    | CInputPropsNoFormulas
    | CInputFormulaProps
    ;

export type CInputNode =
    | CInputTextFieldNode
    | CInputBooleanFieldNode
    | CInputChipFieldNode
    | CInputDateFieldNode
    | CInputDateTimeFieldNode
    | CInputEmailFieldNode
    | CInputImageFieldNode
    | CInputFileFieldNode
    | CInputNumberFieldNode
    | CInputRichTextFieldNode
    | CInputUrlFieldNode
    | CInputIntervalFieldNode
    | CInputJsonNode
    | CInputSelectNode
    | CInputReferenceNode
    | CInputLookupNode
    | CInputFormulaNode
    ;

export interface CFormProps {
    /**@TJS-format frmdb-resource-name */
    resource: string;
    resourceId?: string;
    disabled?: boolean;

    enabledActions?: FormAction[];
}

export interface CFormNode extends CFormProps, PageNodeBase {
    _tag: 'CForm';
    children?: PageNode[];
}


interface CElementPropsBase {
    box?: BoxProps;
    item?: GridItemProps;
}

interface ButtonProps {
    title: string;
    color?: 'default'
    | 'inherit'
    | 'primary'
    | 'secondary';
    variant?: 'contained'
    | 'outlined'
    | 'text';
    size?: 'large'
    | 'medium'
    | 'small';
    startIconName?: string;
    navigateTo?: string;//TODO: allow only page names, if id or other parameters are required check validity
}

export interface CElementTextProps extends CElementPropsBase {
    cElementType: "Text";
    content: string;
    typography?: TypographyProps;
}
export interface CElementTextNode extends PageNodeBase, CElementTextProps {
    _tag: "CElement";
}

export interface CElementActionProps extends CElementPropsBase, ButtonProps {
    cElementType: "Action";
}
export interface CElementActionNode extends PageNodeBase, CElementActionProps {
    _tag: "CElement";
}

export interface CElementIconProps extends CElementPropsBase {
    cElementType: "Icon";
    name: string;
}
export interface CElementIconNode extends PageNodeBase, CElementIconProps {
    _tag: "CElement";
}

export interface CElementImageProps extends CElementPropsBase {
    cElementType: "Image";
    url: string;
}
export interface CElementImageNode extends PageNodeBase, CElementImageProps {
    _tag: "CElement";
}

export type CElementProps =
    | CElementTextProps
    | CElementActionProps
    | CElementIconProps
    | CElementImageProps
    ;

export type CElementNode =
    | CElementTextNode
    | CElementActionNode
    | CElementIconNode
    | CElementImageNode
    ;


export interface CLayoutProps {
    direction?: "row" | "column";
    spacing?: 1 | 2 | 3 | 4;

    box?: BoxProps;
}
export interface CLayoutNode extends CLayoutProps, PageNodeBase {
    _tag: 'CLayout';
    children?: PageNode[];
}

interface CBlockPropsBase {
    title?: string;
    subtitle?: string;
    body?: string;
    box?: BoxProps;
    item?: GridItemProps;
}

export interface CBlockHeadingProps extends CBlockPropsBase {
    cBlockType: "Heading";
}
export interface CBlockHeadingNode extends PageNodeBase, CBlockHeadingProps {
    _tag: "CBlock";
}

export interface CBlockMediaProps extends CBlockPropsBase {
    cBlockType: "Media";
}
export interface CBlockMediaNode extends PageNodeBase, CBlockMediaProps {
    _tag: "CBlock";
}

export interface CBlockCardsProps extends CBlockPropsBase {
    cBlockType: "Cards";
}
export interface CBlockCardsNode extends PageNodeBase, CBlockCardsProps {
    _tag: "CBlock";
}

export type CBlockProps =
    | CBlockHeadingProps
    | CBlockMediaProps
    | CBlockCardsProps
    ;

export type CBlockNode =
    | CBlockHeadingNode
    | CBlockMediaNode
    | CBlockCardsNode
    ;

export const PageNodeMetadata = {
    CPage: { isCanvas: true, displayName: 'Page' },
    CList: { isCanvas: true, displayName: 'List' },
    CInput: { isCanvas: false, displayName: 'Input' },
    CForm: { isCanvas: true, displayName: 'Form' },
    CLayout: { isCanvas: true, displayName: 'Row' },
    CBlock: { isCanvas: false, displayName: 'Block' },
    CElement: { isCanvas: false, displayName: 'Element' },
}

export type CanvasPageNode =
    | CPageNode
    | CListNode
    | CFormNode
    | CLayoutNode
    ;
export function isCanvasNode(node: PageNode): node is CanvasPageNode {
    return Object.entries(PageNodeMetadata).filter(([tag, n]) => n.isCanvas).find(([tag, n]) => tag === node._tag) != undefined;
}
export type PageNode =
    | CanvasPageNode
    | CInputNode
    | CElementNode
    | CBlockNode
    ;
