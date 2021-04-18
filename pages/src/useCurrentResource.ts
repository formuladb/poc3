import React, { useState, useEffect } from 'react';
import { FrmdbResource } from './core-domain/records';
import { useLocation } from 'react-router-dom';
import { parseLocation } from './components/editor/Topbar.utils';
import { useResources } from './useResources';

export function useCurrentResource(): FrmdbResource | undefined {
    const resources = useResources();
    const location = useLocation();
    let pageData = parseLocation(location.pathname);
    const resource = pageData.parsedPath[0].resourceName;

    return resources.find(r => r.id == resource);
}
