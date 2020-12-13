
import {decode as decodeDAGandTree, encode as encodeDAGandTree } from "./DAGandTreeCoder";
import {decode as decodeGraph, encode as encodeGraph } from "./graphCoder"
import {all, simpleWithExtensionAndUpgrade} from "./exampleGraphs"
import {equals, Graph} from "./graph"
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'
import {flatten, map, zip} from "fp-ts/Array"
import { getSemigroup } from 'fp-ts/lib/NonEmptyArray'
import { getValidation,Either, mapLeft, orElse, right } from 'fp-ts/lib/Either'
import { pipe } from "fp-ts/lib/function";
import { allowedNodeEnvironmentFlags } from "process";
class coder{
    constructor(
        readonly encode:(graph:Graph)=>string,
        readonly decode:(code:string)=>Graph
    ){}
}
const coders = [
    new coder(encodeDAGandTree,decodeDAGandTree),
    new coder(encodeGraph,decodeGraph)
]
function getEvaluation(coder:coder){
    return (graph:Graph)=>{
        const encoded = coder.encode(graph);
        const decoded = coder.decode(encoded);
        return {
            encoded,
            codeLenght:encoded.length,
            correct: equals(graph)(decoded)
        }
    }
}
function traspose<T>(arr:T[][]){
    return arr[0].map((_,idx)=>arr.map(elem=>elem.filter((_,jdx)=>jdx===idx)).flat())
}
function evaluationDataToString(data:{encoded:string,codeLenght:number,correct:boolean}){
    return `${data.correct?"[SUCC]":"[FAIL]"}: ${data.codeLenght}`
}
const results = pipe(
    coders.map(coder=>all.map(getEvaluation(coder))),
    map(map(evaluationDataToString)),
    traspose
)
results.forEach(elem=>console.log(...elem));