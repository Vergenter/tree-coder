import { idFromURLCode, idToURLCode, numberToURLCode, SEPARATOR } from './urlHandler';
import { getSkill, Graph } from './graph';
import { decodeSequence, encodeSequence } from './sequenceCoder/sequenceCoder';
import { decodeUpgrades, encodeUpgrades } from './upgradeCoder/upgradeCoder';
import { decodeDAG, encodeDAG} from './DAGcoder/DAGcoder';
import { decodeEdges, encodeEdges } from './edgeCoder/edgeCoder';
/**
 * 
 * @return [noEdgesToFirstTier,withEdgesToFirstTier]
 */
function splitGraph(graph:Graph):[Graph,Graph]{
    return [
        {
            nodes:graph.nodes,
            edges:graph.edges.map(node=>node.filter(edge=>graph.nodes[edge].tier!==1))
        },
        {
            nodes:graph.nodes,
            edges:graph.edges.map(node=>node.filter(edge=>graph.nodes[edge].tier===1))
        }
    ]
}
export function encode(graph:Graph){
    const [noEdgesToFirstTier,withEdgesToFirstTier] = splitGraph(graph);
    return [
        encodeSequence(graph.nodes.map(skill=>skill.id).map(idToURLCode)),
        encodeSequence(encodeUpgrades(withEdgesToFirstTier.nodes,withEdgesToFirstTier.edges)),
        encodeEdges(encodeDAG(noEdgesToFirstTier.edges))
    ].join(SEPARATOR)
}
export function decode(code:string){
    const [skillFragment,upgradeFragment,...treeFragment] = code.split(SEPARATOR);
    const skills = decodeSequence(skillFragment).map(idFromURLCode).map(getSkill);
    const upgradeEdges = decodeUpgrades(skills,decodeSequence(upgradeFragment))
    const tree = decodeDAG(decodeEdges(treeFragment.join(SEPARATOR)))
    return {
        nodes:skills,
        edges:upgradeEdges.map((node,index)=>node.concat(tree[index]))
    }
}