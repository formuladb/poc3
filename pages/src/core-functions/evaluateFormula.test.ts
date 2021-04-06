import { evaluateFormula } from './evaluateFormula';

test('evaluateFormula', () => {
    let obj = { id: null as any, state: 'IN_PROGRES'};
    const formula = `IFS(IS_NULL(id), 'value1', IS_NOT_NULL(id), 'value2')`;
    expect(evaluateFormula(obj, formula)).toEqual('value1');
    obj.id = 1;
    expect(evaluateFormula(obj, formula)).toEqual('value2');
});
