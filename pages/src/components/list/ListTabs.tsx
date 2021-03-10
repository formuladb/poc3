import React, { ReactText, useEffect } from 'react';
import { RawForm } from '../form/CForm';
import { Tabs, Tab, AppBar, Paper } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import {
    Link,
    useRouteMatch,
    Switch,
    Route,
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

const TabIcons = [TabIcon1, TabIcon2, TabIcon3, TabIcon4, TabIcon5, TabIcon6, TabIcon7, TabIcon8, TabIcon9];

interface ListTabsProps {
    ids: ReactText[];
    data: { [id: string]: Record };
    resource: string;
    labelSource: string;
    children: null | React.ReactNode;
}
export const ListTabs = ({
    ids,
    data,
    resource,
    labelSource = "id",
    children = null,
}: ListTabsProps) => {
    const redirect = useRedirect();
    let { pathname } = useLocation();
    let { url } = useRouteMatch();

    useEffect(() => {
        if (ids.length > 0 && !pathname.match(new RegExp(`/${resource}/[^/]+$`))) {
            redirect(`${url}/${resource}/${ids[0]}`);
        }
    }, [ids, url]);

    const theme = useTheme();
    const mdScreen = useMediaQuery(theme.breakpoints.up('md'));

    const [currentId, setCurrentId] = React.useState(ids[0]);
    const onChange = (event: React.ChangeEvent<{}>, newValue: string) => {
        setCurrentId(newValue);
    };

    const a11yProps = (id: any) => {
        return {
            id: `simple-tab-${id}`,
            'aria-controls': `simple-tabpanel-${id}`,
        };
    }

    return (<div style={{ padding: '10px' }}>
        <Paper square>
            <Tabs value={currentId} onChange={onChange} aria-label="tabs tbd">
                {ids.map((id, idx) =>
                    <Tab icon={React.createElement(TabIcons[idx])} label={mdScreen ? data[id][labelSource] : undefined}
                        {...a11yProps(id)} value={id} key={id}
                        component={Link} to={`${url}/${resource}/${id}`}
                    />
                )}
            </Tabs>
        </Paper>
        <Switch>
            <Route path={url} exact key="default" render={() =>
                <RawForm resource={resource} record={data[ids[0]]} children={children} />
            } />
            {ids.map((id, idx) =>
                <Route path={`${url}/${resource}/${id}`} key={id} render={() =>
                    <RawForm resource={resource} record={data[id]} children={children} />
                } />
            )}
        </Switch>
    </div>);
};
