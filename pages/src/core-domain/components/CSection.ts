import { PageNodeBase } from "../../core/entity/page";

export interface CDesignBlockPropsBase {
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

export interface CDesignBlockCOVERProps extends CDesignBlockPropsBase {
    cSectionType: 'COVER';
}
export interface CDesignBlockCOVERNode extends PageNodeBase, CDesignBlockCOVERProps {
    _tag: 'CDesignBlock';
}
export interface CDesignBlockHEADERProps extends CDesignBlockPropsBase {
    cSectionType: 'HEADER';
}
export interface CDesignBlockHEADERNode extends PageNodeBase, CDesignBlockHEADERProps {
    _tag: 'CDesignBlock';
}
export interface CDesignBlockMEDIAProps extends CDesignBlockPropsBase {
    cSectionType: 'MEDIA';
}
export interface CDesignBlockMEDIANode extends PageNodeBase, CDesignBlockMEDIAProps {
    _tag: 'CDesignBlock';
}
export interface CDesignBlockCARDSProps extends CDesignBlockPropsBase {
    cSectionType: 'CARDS_IMG';
}
export interface CDesignBlockCARDSNode extends PageNodeBase, CDesignBlockCARDSProps {
    _tag: 'CDesignBlock';
}
export interface CDesignBlockCARDS2Props extends CDesignBlockPropsBase {
    cSectionType: 'CARDS_ICO';
}
export interface CDesignBlockCARDS2Node extends PageNodeBase, CDesignBlockCARDS2Props {
    _tag: 'CDesignBlock';
}

export type CDesignBlockProps = 
    | CDesignBlockCOVERProps
    | CDesignBlockHEADERProps
    | CDesignBlockMEDIAProps
    | CDesignBlockCARDSProps
    | CDesignBlockCARDS2Props
;
export type CDesignBlockNode = 
    | CDesignBlockCOVERNode
    | CDesignBlockHEADERNode
    | CDesignBlockMEDIANode
    | CDesignBlockCARDSNode
    | CDesignBlockCARDS2Node
;
