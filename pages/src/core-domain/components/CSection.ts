import { PageNodeBase } from "../page";

export interface CSectionPropsBase {
    /**@TJS-format frmdb-resource-name */
    resource: string;
    /**@TJS-format frmdb-resource-field-name */
    titleSource: string;
    /**@TJS-format frmdb-resource-field-name */
    subtitleSource?: string;
    /**@TJS-format frmdb-resource-field-name */
    bodySource?: string;
    /**@TJS-format frmdb-resource-field-name */
    mediaUrlSource?: string;
    /**@TJS-format frmdb-resource-field-name */
    mediaTypeSource?: string;
    /**@TJS-format frmdb-resource-field-name */
    infoSource?: string;
    /**@TJS-format frmdb-resource-field-name */
    actionSource?: string;
}

export interface CSectionCOVERProps extends CSectionPropsBase {
    cSectionType: 'COVER';
}
export interface CSectionCOVERNode extends PageNodeBase, CSectionCOVERProps {
    _tag: 'CSection';
}
export interface CSectionHEADERProps extends CSectionPropsBase {
    cSectionType: 'HEADER';
}
export interface CSectionHEADERNode extends PageNodeBase, CSectionHEADERProps {
    _tag: 'CSection';
}
export interface CSectionMEDIAProps extends CSectionPropsBase {
    cSectionType: 'MEDIA';
}
export interface CSectionMEDIANode extends PageNodeBase, CSectionMEDIAProps {
    _tag: 'CSection';
}
export interface CSectionCARDSProps extends CSectionPropsBase {
    cSectionType: 'CARDS_IMG';
}
export interface CSectionCARDSNode extends PageNodeBase, CSectionCARDSProps {
    _tag: 'CSection';
}
export interface CSectionCARDS2Props extends CSectionPropsBase {
    cSectionType: 'CARDS_ICO';
}
export interface CSectionCARDS2Node extends PageNodeBase, CSectionCARDS2Props {
    _tag: 'CSection';
}

export type CSectionProps = 
    | CSectionCOVERProps
    | CSectionHEADERProps
    | CSectionMEDIAProps
    | CSectionCARDSProps
    | CSectionCARDS2Props
;
export type CSectionNode = 
    | CSectionCOVERNode
    | CSectionHEADERNode
    | CSectionMEDIANode
    | CSectionCARDSNode
    | CSectionCARDS2Node
;
