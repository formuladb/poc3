import * as React from 'react';
import { groupBy, sortBy } from 'lodash';
import { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import SettingsIcon from '@material-ui/icons/Settings';
import { useMediaQuery, Theme } from '@material-ui/core';
import {
    useTranslate,
    DashboardMenuItem,
    MenuItemLink,
    MenuProps,
} from 'react-admin';
import { AppState } from '../../types';
import SubMenu from './SubMenu';
import { useResources } from '../../useResources';
import { FrmdbResourceI } from '../../core/entity/PrwTable';
import { AppIcon } from '../generic/AppIcon';
import { groupByUniqProp } from '../../utils';

const Menu: FC<MenuProps> = ({ onMenuClick, logout, dense = false }) => {
    const [resourceTree, setResourceTree] = useState([] as { parentRes: FrmdbResourceI, isOpen: boolean, childRes: FrmdbResourceI[] }[]);

    const handleToggle = (resId: string) => {
        let newState = [...resourceTree];
        let res = newState.find(r => r.parentRes.id === resId);
        res!.isOpen = !res?.isOpen;
        setResourceTree(newState);
    };

    const resources = useResources();
    useEffect(() => {
        const resById = groupByUniqProp(resources, 'id');
        const resByParent = groupBy(resources, 'parent');
        let menuResources: typeof resourceTree = [];
        for (let [parentResName, childRes] of Object.entries(resByParent)) {
            let parentRes = resById[parentResName];
            if (parentRes) {
                //@ts-ignore
                childRes = sortBy(childRes, 'menu_order');
                menuResources.push({ parentRes, childRes, isOpen: true });
            }
        }
        menuResources = sortBy(menuResources, 'parentRes.menu_order');
        setResourceTree(menuResources);    
    }, [resources]);

    return <MenuInner resourceTree={resourceTree} handleToggle={handleToggle}
    onMenuClick={onMenuClick} logout={logout} dense={dense} />;
    
};


function MenuInner({resourceTree, handleToggle, onMenuClick, logout, dense}) {
    const translate = useTranslate();
    const isXSmall = useMediaQuery((theme: Theme) =>
        theme.breakpoints.down('xs')
    );
    const open = useSelector((state: AppState) => state.admin.ui.sidebarOpen);
    useSelector((state: AppState) => state.theme); // force rerender on theme change

    return (
        <div style={{marginTop: "10px"}}>
            {/* {' '} */}
            {/* <DashboardMenuItem onClick={onMenuClick} sidebarIsOpen={open} /> */}
            {resourceTree.map(({ parentRes, childRes, isOpen }) =>
                <SubMenu
                    handleToggle={() => handleToggle(parentRes.id)}
                    isOpen={isOpen}
                    sidebarIsOpen={open}
                    name={`resources.${parentRes.id}.name`}
                    icon={<AppIcon name={parentRes.icon} />}
                    dense={dense}
                    key={parentRes.id}
                >
                    {childRes.map(res =>
                        <MenuItemLink
                            to={`/${res.id}`}
                            primaryText={translate(`resources.${res.id}.name`, {
                                smart_count: 2,
                            })}
                            leftIcon={<AppIcon name={res.icon} />}
                            onClick={onMenuClick}
                            sidebarIsOpen={open}
                            dense={dense}
                            key={res.id}
                        />
                    )}
                </SubMenu>
            )}

            {isXSmall && (
                <MenuItemLink
                    to="/configuration"
                    primaryText={translate('page.configuration')}
                    leftIcon={<SettingsIcon />}
                    onClick={onMenuClick}
                    sidebarIsOpen={open}
                    dense={dense}
                />
            )}
            {isXSmall && logout}
        </div>
    );
}

export default Menu;
