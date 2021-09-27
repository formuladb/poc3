import React, { ReactText, useEffect } from 'react';
import { RawForm } from '../form/RawForm';
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
import { CListPropsBase, FormAction } from '../../core/entity/page';
import { toString } from 'lodash';

interface ListTabsProps {
    ids: ReactText[];
    data: { [id: string]: Record };
    resource: string;
    labelSource: string;
    formActions?: FormAction[];
    children: null | React.ReactNode;
}
export const ListTabs = ({
    ids,
    data,
    resource,
    labelSource = "id",
    formActions,
    children = null,
}: ListTabsProps) => {
    const redirect = useRedirect();
    let { pathname } = useLocation();
    let { url } = useRouteMatch();

    const match = pathname.match(new RegExp(`/${resource}/([^/]+)$`));
    const [currentId, setCurrentId] = React.useState(match?.[1] || ids[0]);

    useEffect(() => {
        if (ids.length > 0 && !match) {
            redirect(`${url}/${resource}/${ids[0]}`);
        }
        setCurrentId(match?.[1] || ids[0]);
    }, [ids, match]);

    const theme = useTheme();
    const mdScreen = useMediaQuery(theme.breakpoints.up('md'));

    const onChange = (event: React.ChangeEvent<{}>, newValue: string) => {
        setCurrentId(newValue);
    };

    const a11yProps = (id: any) => {
        return {
            id: `simple-tab-${id}`,
            'aria-controls': `simple-tabpanel-${id}`,
        };
    }

    return (<div style={{ padding: '10px', maxWidth: "70vw" }}>
        <Paper square style={{ margin: "0 30px 0 30px" }}>
            <Tabs value={currentId + ''} onChange={onChange} aria-label="tabs tbd"
                variant="scrollable" scrollButtons="auto"
            >
                {ids.map((id, idx) =>
                    <Tab label={mdScreen ? data[id][labelSource] : idx}
                        {...a11yProps(id)} value={id + ''} key={id}
                        component={Link} to={`${url}/${resource}/${id}`}
                    />
                )}
            </Tabs>
        </Paper>
        <Switch>
            <Route path={url} exact key="default" render={() =>
                <RawForm resource={resource} record={data[ids[0]]} children={children}
                    enabledActions={formActions} nextSiblingResourceId={toString(ids[1])} />
            } />
            {ids.map((id, idx) =>
                <Route path={`${url}/${resource}/${id}`} key={id} render={() =>
                    <RawForm resource={resource} record={data[id]} children={children}
                        enabledActions={formActions} nextSiblingResourceId={toString(ids[idx + 1])} />
                } />
            )}
        </Switch>
    </div>);
};
