import { idFromURLCode, idToURLCode, SEPARATOR } from '../urlHandler';
import { getSkill, Graph } from '../graph';
import { decodeSequence, encodeSequence } from '../sequenceCoder/sequenceCoder';
import { decodeUpgrades, encodeUpgrades } from '../upgradeCoder/uniqueCoder';
import { decodeDAG, encodeDAG} from '../DAGcoder/DAGcoder';
import { decodeEdges, encodeEdges } from '../edgeCoder/edgeCoder';
import { splitGraph } from './utils';
import { left, map, right } from 'fp-ts/lib/Either';
import validateGraphAsSkillTree from '../treeValidator';
import { pipe } from 'fp-ts/lib/function';
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
export function encode(graph:Graph){
    return pipe(
        validateGraphAsSkillTree(graph),
        map((graph:Graph)=>{
            const [noEdgesToFirstTier,withEdgesToFirstTier] = splitGraph(graph);
            return [
                encodeSequence(graph.nodes.map(skill=>skill.id).map(idToURLCode)),
                encodeSequence(encodeUpgrades(withEdgesToFirstTier.edges)),
                encodeEdges(encodeDAG(noEdgesToFirstTier.edges))
            ].join(SEPARATOR)
        })
    )
}
export function decode(code:string){
    const [skillFragment,upgradeFragment,...treeFragment] = code.split(SEPARATOR);
    return (skillFragment?.length>0 && upgradeFragment?.length>0&& treeFragment.length>0)?right((()=>{
        const skills = decodeSequence(skillFragment).map(idFromURLCode).map(getSkill);
        const upgradeEdges = decodeUpgrades(decodeSequence(upgradeFragment))
        const tree = decodeDAG(decodeEdges(treeFragment.join(SEPARATOR)))
        return {
            nodes:skills,
            edges:upgradeEdges.map((node,index)=>node.concat(tree[index]))
        }
    })()):left(["code is invalid"] as NonEmptyArray<string>);
    
}