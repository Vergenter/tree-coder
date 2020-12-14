import { incorrectGraphLessEdges } from './exampleGraphs';
import { Either, mapLeft,fromPredicate, left, right, getValidation, map } from 'fp-ts/lib/Either';
import { sequenceT } from 'fp-ts/lib/Apply';
import { pipe } from 'fp-ts/lib/function';
import { getSemigroup, NonEmptyArray,of } from 'fp-ts/lib/NonEmptyArray';
import { Graph } from './graph';

const nodesMatchEdges=fromPredicate((graph:Graph)=>graph.edges.length===graph.nodes.length,()=>of(["Nodes don't match edges"]));
const edgeToCorrectIndex=(graph:Graph)=>{
    const result = graph.edges.map((node,index)=>{
        const incorrectEdges = node.filter((edge:number)=>!Number.isInteger(edge)||edge<0||edge>=graph.nodes.length);
        return incorrectEdges.map(edge=>`node[${index}]: has incorrect edges: [${incorrectEdges.join(', ')}]`)
    }).flat()
    return result.length?left(of(result)):right(graph);
}
const advanceAndUpgradesCorrect=(graph:Graph)=>{
    
}
export default function validateGraphAsSkillTree(graph:Graph){
    return pipe(
        sequenceT(getValidation(getSemigroup<string[]>()))(
            nodesMatchEdges(graph),
            edgeToCorrectIndex(graph)
        ),
        map(()=>pipe(
            sequenceT(getValidation(getSemigroup<string[]>()))(
                nodesMatchEdges(graph),
                edgeToCorrectIndex(graph)
            ),
            map(()=>graph)
        ))
    )
    //validate connections:
    //// nodes match edges
    //// nodes are integer
    //// connections target correct index
    //// validate advance&upgrades
    //// validate extension
    //// all advanced has connections
}
const result = validateGraphAsSkillTree(incorrectGraphLessEdges);
