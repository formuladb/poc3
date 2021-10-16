import { useEditor, Element } from '@craftjs/core';
import {
    Box,
    Typography,
    Grid,
    Button as MuiButton,
    Tooltip
} from '@material-ui/core';
import React from 'react';

import ElementIcon from '@material-ui/icons/Crop75';
import FieldIcon from '@material-ui/icons/DnsOutlined';
import BlockIcon from '@material-ui/icons/BurstMode';
import LayoutIcon from '@material-ui/icons/ViewModuleOutlined';
import ListIcon from '@material-ui/icons/ListAltOutlined';
import FormIcon from '@material-ui/icons/WidgetsOutlined';

import TipIcon from '@material-ui/icons/EmojiObjects';

import ElementActionIcon from '@material-ui/icons/Crop75';
import ElementIconIcon from '@material-ui/icons/SentimentSatisfied';
import ElementImageIcon from '@material-ui/icons/Image';


import BlockHeadingIcon from '@material-ui/icons/Title';
import BlockMediaIcon from '@material-ui/icons/PhotoLibrary';
import BlockCardsIcon from '@material-ui/icons/Apps';

import FieldTextFieldIcon from '@material-ui/icons/TextFields';
import FieldBooleanFieldIcon from '@material-ui/icons/Check';
import FieldChipFieldIcon from '@material-ui/icons/SupervisedUserCircle';
import FieldDateFieldIcon from '@material-ui/icons/Event';
import FieldDateTimeFieldIcon from '@material-ui/icons/Schedule';
import FieldEmailFieldIcon from '@material-ui/icons/AlternateEmail';
import FieldImageFieldIcon from '@material-ui/icons/Image';
import FieldFileFieldIcon from '@material-ui/icons/AttachFile';
import FieldNumberFieldIcon from '@material-ui/icons/Filter2';
import FieldRichTextFieldIcon from '@material-ui/icons/FormatColorText';
import FieldUrlFieldIcon from '@material-ui/icons/Link';
import FieldIntervalFieldIcon from '@material-ui/icons/SwapHoriz';
import FieldJsonIcon from '@material-ui/icons/Code';
import FieldSelectIcon from '@material-ui/icons/MenuOpen';
import FieldReferenceIcon from '@material-ui/icons/ArrowRightAlt';
import FieldLookupIcon from '@material-ui/icons/FindInPage';
import FieldFormulaIcon from '@material-ui/icons/Build';


import { CButton } from '../page/CButton';
import { CBlock } from '../page/CBlock';
import { CLayout } from '../page/CLayout';
import { CElement } from '../page/CElement';
import { CForm } from '../form/CForm';
import { CInput } from '../form/CInput';
import { CList } from '../list/CList';

export const Toolbox = () => {
    const { connectors } = useEditor();

    return (
        <Box px={2} py={2}>
            <Grid
                container
                spacing={1}
            >
                <Grid md={6} container direction="column" item>
                    <Tooltip arrow title={<>
                        <div>Drag new Element onto the page: </div>
                        <span><ElementActionIcon style={{ fontSize: 12 }} /> Action</span>,&nbsp;
                        <span><ElementIconIcon style={{ fontSize: 12 }} /> Icon</span>,&nbsp;
                        <span><ElementImageIcon style={{ fontSize: 12 }} /> Image</span>
                    </>}>
                        <MuiButton style={{ textTransform: 'none', cursor: 'grab' }}
                            ref={(ref) =>
                                connectors.create(ref, <CElement cElementType="Action" title="edit me ..." />)
                            }
                            variant="contained"
                        >
                            <ElementIcon /> Element
                        </MuiButton>
                    </Tooltip>
                </Grid>
                <Grid md={6} container direction="column" item>
                    <Tooltip arrow title={<>
                        <div>Drag new Block onto the page: </div>
                        <span><BlockHeadingIcon style={{ fontSize: 12 }} /> Heading</span>,&nbsp;
                        <span><BlockMediaIcon style={{ fontSize: 12 }} /> Media</span>,&nbsp;
                        <span><BlockCardsIcon style={{ fontSize: 12 }} /> Cards</span>
                    </>}>
                        <MuiButton style={{ textTransform: 'none', cursor: 'grab' }}
                            ref={(ref) => connectors.create(ref, <CBlock cBlockType="Heading" />)}
                            variant="contained"
                        >
                            <BlockIcon /> Block
                        </MuiButton>
                    </Tooltip>
                </Grid>
                <Grid md={6} container direction="column" item>
                    <Tooltip arrow title={<>
                        <div>A Layout defined the placement and spacing of its children.</div>
                    </>}>
                        <MuiButton style={{ textTransform: 'none', cursor: 'grab' }}
                            ref={(ref) => connectors.create(ref, <Element canvas is={CLayout} ><CElement cElementType="Action" title="Edit me ..." /></Element>)}
                            variant="contained"
                        >
                            <LayoutIcon /> Layout
                        </MuiButton>
                    </Tooltip>
                </Grid>
                <Grid md={6} container direction="column" item>
                    <Tooltip arrow title={<>
                        <div>User data collected with a Form will be stored in the current table.</div>
                    </>}>
                        <MuiButton style={{ textTransform: 'none', cursor: 'grab' }}
                            ref={(ref) => connectors.create(ref, <Element canvas is={CForm} resource="prw_pages">Add children here</Element>)}
                            variant="contained"
                        >
                            <FormIcon /> Form
                        </MuiButton>
                    </Tooltip>
                </Grid>
                <Grid md={6} container direction="column" item>
                    <Tooltip arrow title={<>
                        <div>Drag new Field onto a Form: </div>
                        <span><FieldTextFieldIcon style={{ fontSize: 12 }} /> TextField</span>,&nbsp;
                        <span><FieldBooleanFieldIcon style={{ fontSize: 12 }} /> BooleanField</span>,&nbsp;
                        <span><FieldChipFieldIcon style={{ fontSize: 12 }} /> ChipField</span>,&nbsp;
                        <span><FieldDateFieldIcon style={{ fontSize: 12 }} /> DateField</span>,&nbsp;
                        <span><FieldDateTimeFieldIcon style={{ fontSize: 12 }} /> DateTimeField</span>,&nbsp;
                        <span><FieldEmailFieldIcon style={{ fontSize: 12 }} /> EmailField</span>,&nbsp;
                        <span><FieldImageFieldIcon style={{ fontSize: 12 }} /> ImageField</span>,&nbsp;
                        <span><FieldFileFieldIcon style={{ fontSize: 12 }} /> FileField</span>,&nbsp;
                        <span><FieldNumberFieldIcon style={{ fontSize: 12 }} /> NumberField</span>,&nbsp;
                        <span><FieldRichTextFieldIcon style={{ fontSize: 12 }} /> RichTextField</span>,&nbsp;
                        <span><FieldUrlFieldIcon style={{ fontSize: 12 }} /> UrlField</span>,&nbsp;
                        <span><FieldIntervalFieldIcon style={{ fontSize: 12 }} /> IntervalField</span>,&nbsp;
                        <span><FieldJsonIcon style={{ fontSize: 12 }} /> Json</span>,&nbsp;
                        <span><FieldSelectIcon style={{ fontSize: 12 }} /> Select</span>,&nbsp;
                        <span><FieldReferenceIcon style={{ fontSize: 12 }} /> Reference</span>,&nbsp;
                        <span><FieldLookupIcon style={{ fontSize: 12 }} /> Lookup</span>,&nbsp;
                        <span><FieldFormulaIcon style={{ fontSize: 12 }} /> Formula</span>
                    </>}>
                        <MuiButton style={{ textTransform: 'none', cursor: 'grab' }}
                            ref={(ref) => connectors.create(ref, <CInput resource="prw_pages" source="id" cInputType='TextField' />)}
                            variant="contained"
                        >
                            <FieldIcon /> Field
                        </MuiButton>
                    </Tooltip>
                </Grid>

                <Grid md={6} container direction="column" item>
                    <MuiButton style={{ textTransform: 'none', cursor: 'grab' }}
                        ref={(ref) => connectors.create(ref, <Element canvas is={CList} cListType="Datagrid" resource="prw_pages" labelSource="id" children={null} />)}
                        variant="contained"
                    >
                        <ListIcon /> List
                    </MuiButton>
                </Grid>
            </Grid>
        </Box>
    );
};

