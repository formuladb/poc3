import React, { useContext } from 'react';
import { ResourceFieldDef } from '../../core/entity/fields';
import { CInputProps } from '../../core/entity/page';
import { Record } from 'react-admin';

export interface RawFormContextData {
    isCreate: boolean;
    resource: string;
    record: Record | undefined;
    recordFieldsInUrl: Partial<Record> | undefined;
    fieldDefsByName: {[source: string]: ResourceFieldDef};
    inputs: {[name: string]: CInputProps};
    addInput(name: string, props: CInputProps);
}
export const RawFormContext = React.createContext({} as RawFormContextData);

export function useRawFormContext(): RawFormContextData {
    const contextData = useContext(RawFormContext);

    return contextData;
}
