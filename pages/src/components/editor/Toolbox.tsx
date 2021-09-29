import { useEditor, Element } from '@craftjs/core';
import {
    Box,
    Typography,
    Grid,
    Button as MuiButton,
} from '@material-ui/core';
import React from 'react';

import ActionIcon from '@material-ui/icons/CallToActionOutlined';
import FieldIcon from '@material-ui/icons/DnsOutlined';
import SectionIcon from '@material-ui/icons/ViewDayOutlined';
import LayoutIcon from '@material-ui/icons/ViewModuleOutlined';
import ListIcon from '@material-ui/icons/ListAltOutlined';
import FormIcon from '@material-ui/icons/WidgetsOutlined';

import { CButton } from '../page/CButton';
import { CDesignBlock } from '../page/CDesignBlock';
import { CLayout } from '../page/CLayout';
import { CText } from '../page/CText';
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
                    <MuiButton style={{ textTransform: 'none' }}
                        ref={(ref) =>
                            connectors.create(ref, <CButton text="Click me" size="small" />)
                        }
                        variant="contained"
                    >
                        <ActionIcon /> Action
                    </MuiButton>
                </Grid>
                <Grid md={6} container direction="column" item>
                    <MuiButton style={{ textTransform: 'none' }}
                        ref={(ref) => connectors.create(ref, <CDesignBlock />)}
                        variant="contained"
                    >
                        <SectionIcon /> Design Block
                    </MuiButton>
                </Grid>
                <Grid md={6} container direction="column" item>
                    <MuiButton style={{ textTransform: 'none' }}
                        ref={(ref) => connectors.create(ref, <Element canvas is={CLayout} ><CText text="Add CCol components here" /></Element>)}
                        variant="contained"
                    >
                        <LayoutIcon /> Layout
                    </MuiButton>
                </Grid>
                <Grid md={6} container direction="column" item>
                    <MuiButton style={{ textTransform: 'none' }}
                        ref={(ref) => connectors.create(ref, <Element canvas is={CForm} resource="frmdb_pages">Add children here</Element>)}
                        variant="contained"
                    >
                        <FormIcon /> Form
                    </MuiButton>
                </Grid>
                <Grid md={6} container direction="column" item>
                    <MuiButton style={{ textTransform: 'none' }}
                        ref={(ref) => connectors.create(ref, <CInput resource="frmdb_pages" source="id" cInputType='TextField' />)}
                        variant="contained"
                    >
                        <FieldIcon /> Field
                    </MuiButton>
                </Grid>
                
                <Grid md={6} container direction="column" item>
                    <MuiButton style={{ textTransform: 'none' }}
                        ref={(ref) => connectors.create(ref, <Element canvas is={CList} cListType="Datagrid" resource="frmdb_pages" labelSource="id" children={null} />)}
                        variant="contained"
                    >
                        <ListIcon /> List
                    </MuiButton>
                </Grid>
            </Grid>
        </Box>
    );
};

