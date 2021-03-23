import React, { useContext } from 'react';
import { ResourceFieldDef } from '../../core-domain/fields';
import { CInputProps } from '../../core-domain/page';
import { Record } from 'react-admin';

export interface RawFormContextData {
    isCreate: boolean;
    resource: string;
    record: Record | undefined;
    fieldDefsByName: {[source: string]: ResourceFieldDef};
    inputs: {[name: string]: CInputProps};
    addInput(name: string, props: CInputProps);
}
export const RawFormContext = React.createContext({} as RawFormContextData);

export function useRawFormContext(): RawFormContextData {
    const contextData = useContext(RawFormContext);

    return contextData;
}
