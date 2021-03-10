import React from 'react';


export const NodeWrapper = ({children}: {children: React.ReactNode }) => {

    return (
        <div className="bg-transparent" style={{
            borderStyle: "dashed",
        }}>
            {children}
        </div>
    );
};
