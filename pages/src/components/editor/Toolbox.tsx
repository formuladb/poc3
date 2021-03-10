import { useEditor, Element } from '@craftjs/core';
import {
    Box,
    Typography,
    Grid,
    Button as MuiButton,
} from '@material-ui/core';
import React from 'react';

import { CButton } from '../page/CButton';
import { Card } from '../page/Card';
import { CColumn } from '../page/CColumn';
import { CRow } from '../page/CRow';
import { CPaper } from '../page/CPaper';
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
                        Button
                    </MuiButton>
                </Grid>
                <Grid md={6} container direction="column" item>
                    <MuiButton style={{ textTransform: 'none' }}
                        ref={(ref) => connectors.create(ref, <CText text="Some Text" />)}
                        variant="contained"
                    >
                        Text
                    </MuiButton>
                </Grid>
                <Grid md={6} container direction="column" item>
                    <MuiButton style={{ textTransform: 'none' }}
                        ref={(ref) =>
                            connectors.create(
                                ref,
                                <Element canvas is={CPaper} padding={20} />
                            )
                        }
                        variant="contained"
                    >
                        Paper
                    </MuiButton>
                </Grid>
                <Grid md={6} container direction="column" item>
                    <MuiButton style={{ textTransform: 'none' }}
                        ref={(ref) => connectors.create(ref, <Card />)}
                        variant="contained"
                    >
                        Card
                    </MuiButton>
                </Grid>
                <Grid md={6} container direction="column" item>
                    <MuiButton style={{ textTransform: 'none' }}
                        ref={(ref) => connectors.create(ref, <Element canvas is={CRow} padding={20}><CText text="Add CCol components here" /></Element>)}
                        variant="contained"
                    >
                        Row
                    </MuiButton>
                </Grid>
                <Grid md={6} container direction="column" item>
                    <MuiButton style={{ textTransform: 'none' }}
                        ref={(ref) => connectors.create(ref, <Element canvas is={CColumn} padding={10}>Add children here</Element>)}
                        variant="contained"
                    >
                        Column
                    </MuiButton>
                </Grid>
                <Grid md={6} container direction="column" item>
                    <MuiButton style={{ textTransform: 'none' }}
                        ref={(ref) => connectors.create(ref, <Element canvas is={CForm} resource="frmdb_pages">Add children here</Element>)}
                        variant="contained"
                    >
                        Form
                    </MuiButton>
                </Grid>
                <Grid md={6} container direction="column" item>
                    <MuiButton style={{ textTransform: 'none' }}
                        ref={(ref) => connectors.create(ref, <CInput resource="frmdb_pages" source="id" cInputType='TextField' />)}
                        variant="contained"
                    >
                        Input
                    </MuiButton>
                </Grid>
                
                <Grid md={6} container direction="column" item>
                    <MuiButton style={{ textTransform: 'none' }}
                        ref={(ref) => connectors.create(ref, <Element canvas is={CList} cListType="Datagrid" resource="frmdb_pages" labelSource="id" children={null} />)}
                        variant="contained"
                    >
                        List
                    </MuiButton>
                </Grid>
            </Grid>
        </Box>
    );
};

