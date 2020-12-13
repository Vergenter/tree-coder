import {Graph,Skill} from '../graph'
import {Ord} from 'fp-ts/Ord'
import {sort,snoc} from 'fp-ts/Array'
import { numberToURLCode,numberFromURLCode } from '../urlHandler';
function getOrdForSkillIndeces(skills:Skill[]):Ord<number>{
    return {
        equals:(a,b)=>skills[a].tier===skills[b].tier,
        compare:(a,b)=>skills[a].tier>skills[b].tier?-1:skills[a].tier===skills[b].tier?0:1
    }
}
export function encodeUpgrades(nodes:Skill[],edgesToFirstTierOnly:number[][]){
    //upgrades once
    //upgrades with correct pair
    const inverseEdges = nodes.map<number[]>(edge=>[]);
    edgesToFirstTierOnly.forEach((node,nodeIndex)=>node.forEach(edge=>inverseEdges[edge].push(nodeIndex)))
    const sortedInverseEdges = inverseEdges.map(sort(getOrdForSkillIndeces(nodes)))
    return sortedInverseEdges.map((node,index)=>snoc(node,index)).map(node=>node.map(numberToURLCode))
        .filter(node=>node.length>1)
        .flat()
}
function upgradesDecoder(skills:Skill[]){
    return (memory:{arr:number[][],currIndex:number,lastTier:number,threeFirstTier:boolean},index:number)=>{
        const newCurrIndex =  memory.currIndex===undefined || (memory.threeFirstTier&&1 ===skills[index].tier) ||skills[index].tier<memory.lastTier;
        return {
            threeFirstTier: 1 === memory.lastTier && memory.lastTier === skills[index].tier,
            currIndex: newCurrIndex ? index: memory.currIndex,
            lastTier: newCurrIndex?undefined:skills[index].tier,
            arr: memory.arr.map((node,nodeIndex)=>nodeIndex!==index || newCurrIndex ?node:snoc(node,memory.currIndex))
        }
    }
}
export function decodeUpgrades(nodes:Skill[],coded:string[]){
    return coded.map(numberFromURLCode).reverse().reduce(upgradesDecoder(nodes),{
        arr:nodes.map<number[]>(edge=>[]),
        currIndex:undefined,
        threeFirstTier:false,
        lastTier:undefined
    }).arr;
}