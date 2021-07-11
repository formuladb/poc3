import React from 'react';
import Icon from '@material-ui/core/Icon'
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
    imageIcon: {
        display: 'flex',
        height: 'inherit',
        width: 'inherit'
    },
    iconRoot: {
        textAlign: 'center'
      }
});

export function AppIcon({ name, ...props }) {
    const classes = useStyles();

    return <Icon classes={{root: classes.iconRoot}}>
        <img className={classes.imageIcon} src={`https://db0v4c9q87qfx.cloudfront.net/icons/${name}.svg`} />
    </Icon>

    // const [svg, setSvg] = useState<string>(`<circle cx="50" cy="50" r="40" stroke="black" />`);

    // useEffect(() => {
    //     fetch(`https://storage.googleapis.com/formuladb-static-assets/public-svg-icons/material-design-icons/${name}.svg`, {
    //             headers: {
    //                 'accept': 'image/svg+xml',
    //             },
    //         })
    //         .then(r => r.text())
    //         .then(s => setSvg(s.replace(/<svg.+?>/, '').replace(/<\/svg>/, '')));
    //     ;
    // }, [name]);

    // return (
    //     <SvgIcon {...props}>
    //         {svg}
    //     </SvgIcon>
    // );
}
