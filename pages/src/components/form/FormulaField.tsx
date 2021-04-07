import React, { ReactElement, } from 'react';
import { Record } from 'react-admin';
import { evaluateFormula } from '../../core-functions/evaluateFormula';
import { CInputFormulaProps } from '../../core-domain/page';
import { FField } from './FField';

interface Props {
    field: CInputFormulaProps
    record?: Record;
}
export function FormulaField({ 
    field,
    record
}: Props) {
    const value = evaluateFormula(record as {}, field.formula);
    const newRecord = {...record, [field.source]: value};
    return <FField field={field.field} record={newRecord} />;
}
