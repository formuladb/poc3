import React, { useState, useEffect } from 'react';
import { FrmdbResourceI } from './core/entity/FrmdbResource';
import { useLocation } from 'react-router-dom';
import { parseLocation } from './location_utils';
import { useResources } from './useResources';

export function useCurrentResource(): FrmdbResourceI | undefined {
    const resources = useResources();
    const location = useLocation();
    let pageData = parseLocation(location.pathname);
    const resource = pageData.resource;

    return resources.find(r => r.id == resource);
}
