import { FieldType } from "./fields";

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

export const CListTypes = {
    Tabs: 0,
    // SingleFieldList: 0,
    Table: 0,
    Datagrid: 0,
    FormList: 0,
    // SimpleList: 0,
}

export interface CListProps {
    cListType: keyof typeof CListTypes;
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

interface ActionCREATE {
    actionType: 'CREATE';
}
export interface ActionEXPORT {
    actionType: 'EXPORT';
}
export interface ActionIMPORTDATA {
    actionType: 'IMPORTDATA';
    fieldMappings: {importedField: string, field: string}[];
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


export interface ActionSAVE {
    actionType: 'SAVE';
    label?: string;
}

export type FormAction = 
    | ActionPRINT
    | ActionSAVE
;

export interface CListNode extends PageNodeBase, CListProps {
    _tag: 'CList';
    children?: PageNode[];
}

interface GridItemProps {
    width?: 2 | 3 | 4 | 6 | 8 | 10 | 12;
}

interface CInputPropsBase extends GridItemProps {
    /**@TJS-format frmdb-resource-name */
    resource: string;
    /**@TJS-format frmdb-resource-field-name */
    source: string;

    variant?: 'standard' | 'filled' | 'outlined';
    size?: 'small';
    disabled?: boolean;
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
export interface CInputRichTextFieldProps extends CInputPropsBase {
    cInputType: "RichTextField";
    initialValue?: string;
}
export interface CRichInputTextFieldNode extends PageNodeBase, CInputRichTextFieldProps {
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
    cInputType: "RichTextField";
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

export type CInputProps =
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

export interface CTextProps {
    text: string;
    fontWeight?: "bold" | "bolder" | "lighter";
    textAlign?: "center" | "end" | "justify" | "left" | "match-parent" | "right" | "start";
}
export interface CTextNode extends CTextProps, PageNodeBase {
    _tag: 'CText';
}

export interface CPaperProps {
    background?: string;
    padding?: number;
}
export interface CPaperNode extends CPaperProps, PageNodeBase {
    _tag: 'CPaper';
    children?: PageNode[];
}
export interface CRowProps {
    background?: string;
    padding?: number;
}
export interface CRowNode extends CRowProps, PageNodeBase {
    _tag: 'CRow';
    children?: PageNode[];
}

export const PageNodeMetadata = {
    CPage: { isCanvas: true, displayName: 'Page' },
    CList: { isCanvas: true, displayName: 'List' },
    CInput: { isCanvas: false, displayName: 'Input' },
    CForm: { isCanvas: true, displayName: 'Form' },
    CRow: { isCanvas: true, displayName: 'Row' },
    CPaper: { isCanvas: true, displayName: 'Paper' },
    CText: { isCanvas: false, displayName: 'Text' },
}

export type CanvasPageNode =
    | CPageNode
    | CListNode
    | CFormNode
    | CPaperNode
    | CRowNode
;
export function isCanvasNode(node: PageNode): node is CanvasPageNode {
    return Object.entries(PageNodeMetadata).filter(([tag, n]) => n.isCanvas).find(([tag, n]) => tag === node._tag) != undefined;
}
export type PageNode =
    | CanvasPageNode
    | CInputNode
    | CTextNode
    ;
