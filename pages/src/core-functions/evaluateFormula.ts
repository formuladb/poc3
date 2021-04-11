import { ScalarFunctions }  from "./ScalarFunctions";
// import * as ActionFunctions from "./ActionFunctions";
import { $e2s, parseFormula } from "./parseFormula";
import { Expression, isIdentifier } from "jsep";

const formulaCache: Map<string, CompiledScalarFormula> = new Map();
const expressionCache: Map<string, Expression> = new Map();

interface CompiledScalarFormula {
    scalarFormula: string; 
    formulaFunction: Function;
    functionBoundToContext: Function;
}

/**
 * FIXME/TODO WARNING !!! naive implementation with regards to security
 * 
 * It is very difficult to sandbox the JS code, a Function can always access the global object with 'this' keyword:
 * https://stackoverflow.com/questions/23595880/restrict-access-to-global-context-with-javascript
 * https://github.com/asvd/jailed
 */
function compileScalarFormula(scalarFormula: string, isAction?: boolean): CompiledScalarFormula {
    let ast = parseFormula(scalarFormula);
    expressionCache.set(scalarFormula, ast);
    preProcessAst(ast);
    let formulaFunction = new Function('Ctx', 'Obj', 'return ' + $e2s(ast));
    let functionBoundToContext = formulaFunction.bind(null, ScalarFunctions) as Function;
    return {scalarFormula, formulaFunction, functionBoundToContext};
}

function preProcessAst(node: Expression) {
    switch (node.type) {

        case 'ArrayExpression':
            for (let n of node.elements) {
                preProcessAst(n);
            }
            break;
            // return evaluateArray(node.elements, context);

        case 'BinaryExpression':
            if (node.operator === "=") node.operator = "==";
            preProcessAst(node.left);
            preProcessAst(node.right);
            break;

        case 'CallExpression':
            if (isIdentifier(node.callee)) {
                if (node.callee.name.indexOf('$') === 0) {
                    node.callee.name = 'Obj.' + node.callee.name;
                } else {
                    node.callee.name = 'Ctx.' + node.callee.name;
                }
            } else preProcessAst(node.callee);
            node.arguments.forEach(a => preProcessAst(a));
            break;
        case 'ConditionalExpression':
            preProcessAst(node.test);
            preProcessAst(node.consequent);
            preProcessAst(node.alternate);
            break;

        case 'Identifier':
            node.name = 'Obj.' + node.name;
            break;
            
        case 'Literal':
            break;
        case 'NumberLiteral':
        case 'StringLiteral':
            break;

        case 'LogicalExpression':
            preProcessAst(node.left);
            preProcessAst(node.right);
            break;

        case 'MemberExpression':
            if (isIdentifier(node.object)) preProcessAst(node.object);
            break;

        case 'ThisExpression':
            break;

        case 'UnaryExpression':
            preProcessAst(node.argument);
            break;

        default:
            return undefined;            
    }
}


// export function annotateScalarFormulaWithValues(obj: {}, scalarFormula: string) {
//     let ret = scalarFormula;
//     try {
//         for (let key of Object.keys(obj)) {
//             ret = ret.replace(new RegExp(`\\b${key}\\b`, 'g'), `${key}(${obj[key]})`);
//         }
//     } catch (err) {
//         console.error(err);
//     }
//     return ret;
// }

// export function getExpressionFromScalarFormula(scalarFormula: string) {
//     let expr = expressionCache.get(scalarFormula);
//     if (!expr) {
//         expr = parseFormula(scalarFormula);
//         expressionCache.set(scalarFormula, expr);
//     }
// }
export function evaluateFormula(obj: {}, scalarFormula: string) {
    let compiledFunction = formulaCache.get(scalarFormula);
    if (!compiledFunction) {
        compiledFunction = compileScalarFormula(scalarFormula);
        formulaCache.set(scalarFormula, compiledFunction);
    }
    return compiledFunction.functionBoundToContext(obj);
}

export function getValueOrFormula(obj: {}, value: any) {
    if (isFormula(value)) {
        return evaluateFormula(obj, value);
    } else return value;
}

export function isFormula(value: any) {
    return typeof value === "string" && value.indexOf('(') >= 0;
}
