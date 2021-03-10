import React from 'react';
import { Pagination } from 'react-admin';

export default ({
    largePages = false as boolean, 
    ...props
}) => {
    const rowsPerPageOptions = largePages ? [200, 500, 1000, 5000, 10000, 20000] : [10, 20, 50];
    return <div style={{position: 'sticky', bottom: 0, backgroundColor: 'white', maxWidth: '65vw'}}>
        <Pagination rowsPerPageOptions={rowsPerPageOptions} {...props} />
    </div>;
}
