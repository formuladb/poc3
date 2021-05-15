import React, { useState, useEffect } from 'react';
import { useGetIdentity } from 'react-admin';

export function useCurrentUser() {
    
    const { identity } = useGetIdentity();
    return {
        id: identity?.id,
        username: identity?.username,
        role: identity?.role,
    }
}
