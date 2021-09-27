import React, { useState, useEffect } from 'react';
import { required, useGetIdentity } from 'react-admin';
import { CInputProps } from '../../core/entity/page';

const requiredFn = required();

export function useInitialValueResolver() {
    
    const { identity, loading: identityLoading, error } = useGetIdentity();
    console.log("AAAAA", identity, identityLoading, error);

    return (field: CInputProps): string | number | undefined => {
        if (field.cInputType === "Reference") {
            if (field.initialValue === "CURRENT_USER_ID") {
                return identity?.id;
            }
        }
    }
}
