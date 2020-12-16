import { graphs } from './exampleGraphs';
import { Either, mapLeft,fromPredicate, left, right, getValidation, map,chain } from 'fp-ts/lib/Either';
import { sequenceT } from 'fp-ts/lib/Apply';
import { pipe } from 'fp-ts/lib/function';
import { getSemigroup, NonEmptyArray,fromArray } from 'fp-ts/lib/NonEmptyArray';
import { uniq, map as arrmap} from 'fp-ts/lib/Array'
import {eqNumber} from 'fp-ts/lib/Eq'
import { edgesToParent, Graph, id, Skill } from './graph';
const nodesMatchEdges=fromPredicate((graph:Graph)=>graph.edges.length===graph.nodes.length,()=>["Nodes don't match edges"]as NonEmptyArray<string>);
const edgeToCorrectIndex=(graph:Graph)=>{
    const result = graph.edges.map((node,index)=>{
        const incorrectEdges = node.filter((edge:number)=>!Number.isInteger(edge)||edge<0||edge>=graph.nodes.length);
        return incorrectEdges.map(edge=>`node[${index}]: has incorrect edges: [${incorrectEdges.join(', ')}]`)
    }).flat()
    return result.length?left(result as NonEmptyArray<string>):right(graph);
}
const edgesToItself=(graph:Graph)=>{
    const result = graph.edges.map((node,index)=>node.filter(edge=>edge===index).map(edge=>`node[${index}] connect to itself`)).flat();
    return result.length?left(result as NonEmptyArray<string>):right(graph);
}
const nodesAreUnique=(graph:Graph)=>{
    const ids = graph.nodes.map(skill=>skill.id);
    const duplicates = ids.reduce((a, c) => a.set(c, (a.get(c) || 0) + 1), new Map<id,number>());
    const result = ids.filter(id=>duplicates.get(id)>1).map(id=>`skill with [${id}] has duplicates`);
    return result.length?left(result as NonEmptyArray<string>):right(graph);
}
const firstTierMonogamy=(graph:Graph)=>{
    const result = graph.edges.map(node=>node.filter(edge=>graph.nodes[edge].tier===1)).map((node,index)=>[node,index] as [number[],number])
        .filter(node=>node[0].length>1)
        .map(node=>`node[${node[1]}] connect to multiple first tiers[${node[0].join(', ')}]`)
    return result.length?left(result as NonEmptyArray<string>):right(graph);
}
const validateStructure=(graph:Graph)=>{
    const inverseEdges = edgesToParent(graph.edges)

    const lift=<T>(f:(s:Skill[])=>(s:Skill)=>T)=>(index:number):T=>f(inverseEdges[index].map(i=>graph.nodes[i]))(graph.nodes[index])
    const advance = (parents:Skill[])=>(skill:Skill)=>parents.length===2&&parents.every(parent=>parent.tier+1===skill.tier);
    const extension = (parents:Skill[])=>(skill:Skill)=>parents.length===2&&parents.some(parent=>parent.tier+1===skill.tier)&&parents.some(parent=>parent.tier===skill.tier);
    const upgrade =  (parents:Skill[])=>(skill:Skill)=>
        parents.length%2===0 
        && skill.tier===1 
        && parents.map(parent=>parent.tier)
            .sort()
            .every((tier,index,tiers)=>
                index%2===1
                || (
                    tiers.length>index+1
                    && tier[index]===tier[index+1]
                    && (index-1<0 || tier[index-1] !== tier[index])
                    && (tiers.length<index+2 || tier[index+1] !== tier[index+2])
                )
            );
    const predicates = [
        (index:number)=>graph.nodes[index].tier===1, 
        lift(advance),
        lift(extension),
        lift(upgrade)
    ]
    const result = graph.nodes
        .map((_,index)=>[index,predicates.some(pred=>pred(index))] as [number,boolean])
        .filter(node=>!node[1])
        .map(node=>`node with index ${node[0]} has incorrect parents`);
    return result.length?left(result as NonEmptyArray<string>):right(graph);
}
function validateFoundations(graph:Graph){
    const inverseEdges = edgesToParent(graph.edges)
    const getLowerTierFromSameTier=(tier:number)=>(index:number):any[]=>
        graph.nodes[index].tier===1?[]:inverseEdges[index].map(parentIndex=>graph.nodes[parentIndex].tier===tier?getLowerTierFromSameTier(tier)(parentIndex):parentIndex)
    const getSameTiersFromLowerTier=(tier:number)=>(index:number):any[]=>
        graph.nodes[index].tier===1?[index]:[index,inverseEdges[index]
            .filter(parentIndex=>graph.nodes[parentIndex].tier===tier-1)
            .map(parentIndex=>getSameTiersFromLowerTier(tier)(parentIndex))]
    const getFoundations=(index:number)=>{
        const skillTier = graph.nodes[index].tier;
        return skillTier===1?[] as number[]:pipe(
            index,
            getLowerTierFromSameTier(skillTier),
            (arr)=>arr.flat(Infinity) as number[],
            uniq(eqNumber),
            arrmap(getSameTiersFromLowerTier(skillTier)),
            (arr)=>arr.flat(Infinity) as number[],
            uniq(eqNumber)
        )
    }
    const checkFoundations=(indices:number[],level:number =1 ):boolean=>{
        const uniqueIndeces = uniq(eqNumber)(indices);
        return uniqueIndeces.length>=level
            ? graph.nodes[uniqueIndeces[0]].tier===1
                ?true 
                :checkFoundations(uniqueIndeces.map(getFoundations).flat(),level*2)
            :false;
    }
    const result = graph.nodes.map((_,index)=>index).filter(index=>!checkFoundations([index])).map(index=>`node with index ${index} has incorrect foundations`);
    return result.length?left(result as NonEmptyArray<string>):right(graph);
}
function validateUpgradesFoundations(graph:Graph){
    const inverseEdges = edgesToParent(graph.edges)
    const getLowerTierFromSameTier=(tier:number)=>(index:number):any[]=>
        graph.nodes[index].tier===1?[]:inverseEdges[index].map(parentIndex=>graph.nodes[parentIndex].tier===tier?getLowerTierFromSameTier(tier)(parentIndex):parentIndex)
        const getSameTiersFromLowerTier=(tier:number)=>(index:number):any[]=>
        graph.nodes[index].tier===1?[index]:[index,inverseEdges[index]
            .filter(parentIndex=>graph.nodes[parentIndex].tier===tier-1)
            .map(parentIndex=>getSameTiersFromLowerTier(tier)(parentIndex))]
    const getFoundations=(index:number)=>{
        const skillTier = graph.nodes[index].tier;
        return skillTier===1?[] as number[]:pipe(
            index,
            getLowerTierFromSameTier(skillTier),
            (arr)=>arr.flat(Infinity) as number[],
            uniq(eqNumber),
            arrmap(getSameTiersFromLowerTier(skillTier)),
            (arr)=>arr.flat(Infinity) as number[],
            uniq(eqNumber)
        )
    }
    const checkFoundations=(indices:number[],level:number =1 ):boolean=>{
        const uniqueIndeces = uniq(eqNumber)(indices);
        return uniqueIndeces.length>=level
            ? graph.nodes[uniqueIndeces[0]].tier===1
                ?true 
                :checkFoundations(uniqueIndeces.map(getFoundations).flat(),level*2)
            :false;
    }
    const firstTiers = graph.nodes.map((node,index)=>[index,node.tier===1]).filter(node=>node[1]).map(node=>node[0] as number).filter(index=>inverseEdges[index].length>0)
    const result = firstTiers
        .map(index=>[index,getFoundations(index)
        .map((i,index,foundations)=>index%2===0?[foundations[index],foundations[index+1]]:i)
        .filter((_,index)=>index%2===0)] as [number,[number,number][]])
        .map(pair=>[pair[0],pair[1].filter(tuple=>!checkFoundations([tuple[0],tuple[1]],2))] as [number,[number,number][]])
        .filter(pair=>pair[1].length>0)
        .map(pair=>`node with index ${pair[0]} has incorrect foundations of indeces: ${pair[1].join(", ")}`)
    return result.length?left(result as NonEmptyArray<string>):right(graph);
}
export default function validateGraphAsSkillTree(graph:Graph){
    return pipe(
        sequenceT(getValidation(getSemigroup<string>()))(
            nodesAreUnique(graph),
            nodesMatchEdges(graph),
            edgeToCorrectIndex(graph),
            edgesToItself(graph),
            
        ),
        chain(()=>pipe(
            sequenceT(getValidation(getSemigroup<string>()))(
                firstTierMonogamy(graph),
                validateStructure(graph)
            ),
            chain(()=>pipe(
                sequenceT(getValidation(getSemigroup<string>()))(
                    validateFoundations(graph),
                    validateUpgradesFoundations(graph)
                ),
                map(()=>graph)
            )
            )
        )
        )
    )
}
