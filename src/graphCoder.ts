import { decodeEdges, encodeEdges } from './edgeCoder/edgeCoder';
import { getSkill, Graph } from './graph';
import { decodeSequence, encodeSequence } from './sequenceCoder/sequenceCoder';
import { idFromURLCode, idToURLCode, SEPARATOR } from "./urlHandler";

export function encode(graph:Graph){
    return [
        encodeSequence(graph.nodes.map(skill=>skill.id).map(idToURLCode)),
        encodeEdges(graph.edges)
    ].join(SEPARATOR)
}
export function decode(code:string){
    const [skillFragment,...edgesFramgment] = code.split(SEPARATOR);
    const nodes = decodeSequence(skillFragment).map(idFromURLCode).map(getSkill);
    const edges = decodeEdges(edgesFramgment.join(SEPARATOR))
    return {
        nodes,
        edges
    }
}