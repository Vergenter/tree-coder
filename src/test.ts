
import {decode as decodeDAGSpecial, encode as encodeDAGSpecial } from "./coderSolution/DAGspecialCoder";
import {decode as decodeDAGUnique, encode as encodeDAGUnique } from "./coderSolution/DAGuniqueCoder";
import {decode as decodeGraph, encode as encodeGraph } from "./coderSolution/graphCoder"
import {equals, Graph} from "./graph"
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'
import {flatten, map, zip} from "fp-ts/Array"
import { getOrElse,Either, chain, map as emap,orElse, right } from 'fp-ts/lib/Either'
import { pipe } from "fp-ts/lib/function";
import { graphs } from "./exampleGraphs";
class coder{
    constructor(
        readonly encode:(graph:Graph)=>Either<NonEmptyArray<string>,string>,
        readonly decode:(code:string)=>Either<NonEmptyArray<string>,Graph>
    ){}
}
const coders = [
    new coder(encodeGraph,decodeGraph),
    new coder(encodeDAGSpecial,decodeDAGSpecial),
    new coder(encodeDAGUnique,decodeDAGUnique),
]
function getEvaluation(coder:coder){
    return (graph:Graph)=>pipe(
        graph,
        coder.encode,
        chain((encoded)=>emap<Graph,[string,Graph]>((coded:Graph)=>[encoded,coded])(coder.decode(encoded))),
        emap(pair=>({
            encoded:pair[0],
            codeLenght:pair[0].length,
            correct: equals(graph)(pair[1])
        }))
    )
}
function traspose<T>(arr:T[][]){
    return arr[0].map((_,idx)=>arr.map(elem=>elem.filter((_,jdx)=>jdx===idx)).flat())
}
function evaluationDataToString(data:{encoded:string,codeLenght:number,correct:boolean}){
    return `${data.correct?"[SUCC]":"[FAIL]"}: ${data.codeLenght}`
}
const results = pipe(
    coders.map(coder=>graphs.map(getEvaluation(coder))),
    map(map(emap(evaluationDataToString))),
    map(map(getOrElse<NonEmptyArray<string>,string>(()=>"error"))),
    traspose
)
results.forEach(elem=>console.log(...(elem)));