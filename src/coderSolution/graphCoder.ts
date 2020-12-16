import { map, left, right } from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/function';
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
import { decodeEdges, encodeEdges } from '../edgeCoder/edgeCoder';
import { getSkill, Graph } from '../graph';
import { decodeSequence, encodeSequence } from '../sequenceCoder/sequenceCoder';
import validateGraphAsSkillTree from '../treeValidator';
import { idFromURLCode, idToURLCode, SEPARATOR } from "../urlHandler";

export function encode(graph:Graph){
    return pipe(
        validateGraphAsSkillTree(graph),
        map((graph:Graph)=>{
            return [
                encodeSequence(graph.nodes.map(skill=>skill.id).map(idToURLCode)),
                encodeEdges(graph.edges)
            ].join(SEPARATOR)
        })
    )
}
export function decode(code:string){
    const [skillFragment,...edgesFragment] = code.split(SEPARATOR);
    return (skillFragment?.length>0 && edgesFragment?.length>0)?right({
        nodes:decodeSequence(skillFragment).map(idFromURLCode).map(getSkill),
        edges:decodeEdges(edgesFragment.join(SEPARATOR))
    }):left(["code is invalid"] as NonEmptyArray<string>);
}