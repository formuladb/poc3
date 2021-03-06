import * as React from 'react';
import { forwardRef } from 'react';
import { AppBar, UserMenu, MenuItemLink, useTranslate, useGetIdentity } from 'react-admin';
import Typography from '@material-ui/core/Typography';
import SettingsIcon from '@material-ui/icons/Settings';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    title: {
        flex: 1,
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
    },
    spacer: {
        flex: 1,
    },
});

const ConfigurationMenu = forwardRef<any, any>((props, ref) => {
    const translate = useTranslate();
    return (
        <MenuItemLink
            ref={ref}
            to="/configuration"
            primaryText={translate('page.configuration')}
            leftIcon={<SettingsIcon />}
            onClick={props.onClick}
            sidebarIsOpen
        />
    );
});

const CustomUserMenu = (props: any) => {
    const { loaded, identity } = useGetIdentity();
    return <>
        <UserMenu {...props}>
            <ConfigurationMenu />
        </UserMenu>
    </>;
};

const CustomAppBar = (props: any) => {
    const classes = useStyles();
    return (
        <AppBar {...props} elevation={1} userMenu={<CustomUserMenu />}>
            <Typography
                variant="h6"
                color="inherit"
                className={classes.title}
                id="react-admin-title"
            />
            <img src="/frmdb-bucket/images/logo.png" style={{ height: '35px' }} />
            <span style={{paddingLeft: "5px"}}>
                Federația Română de Fotbal
            </span>
            <span className={classes.spacer} />
        </AppBar>
    );
};

export default CustomAppBar;
