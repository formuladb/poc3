import React, { ReactText, useEffect } from 'react';
import { RawForm } from '../form/RawForm';
import { Tabs, Tab, AppBar, Paper } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import {
    Link,
    useRouteMatch,
    useLocation
} from "react-router-dom";
import { useRedirect, Record } from 'react-admin';
import { CListProps } from '../../core-domain/page';

import TabIcon1 from '@material-ui/icons/Filter1';
import TabIcon2 from '@material-ui/icons/Filter2';
import TabIcon3 from '@material-ui/icons/Filter3';
import TabIcon4 from '@material-ui/icons/Filter4';
import TabIcon5 from '@material-ui/icons/Filter5';
import TabIcon6 from '@material-ui/icons/Filter6';
import TabIcon7 from '@material-ui/icons/Filter7';
import TabIcon8 from '@material-ui/icons/Filter8';
import TabIcon9 from '@material-ui/icons/Filter9';
import { CInput } from '../form/CInput';

const TabIcons = [TabIcon1, TabIcon2, TabIcon3, TabIcon4, TabIcon5, TabIcon6, TabIcon7, TabIcon8, TabIcon9];

interface ListFormListProps {
    ids: ReactText[];
    data: { [id: string]: Record };
    resource: string;
    children: null | React.ReactNode;
}
export const ListFormList = ({
    ids,
    data,
    resource,
    children,
}: ListFormListProps) => {

    const theme = useTheme();
    const mdScreen = useMediaQuery(theme.breakpoints.up('md'));

    return (<>
        {ids.map((id, idx) =>
            <div key={id} style={{ margin: '20px' }}>
                <Paper key={id}>
                    <RawForm resource={resource} record={data[id]}>
                        {children}
                        {/* {idx === 0 && children} for editor to work, we want just the first form to display the original childre, for the rest we want to clone the children */}
                    </RawForm>
                </Paper>
            </div>
        )}
    </>);
};
