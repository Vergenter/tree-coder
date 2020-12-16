export type id = number;
export function getTier(id:id):number{
    return Number.parseInt(id.toString()[0],10);
}
export function s(id:id){
    return getSkill(id);
}
export function getSkill(id:id):Skill{
    return {
        id,
        tier:getTier(id)
    }
}
export interface Skill{
    id:id;
    tier:number;
}
export interface Graph{
    nodes:Skill[];
    edges:number[][];
}
export function edgesToParent(edges:number[][]){
    const inverseEdges = edges.map<number[]>(edge=>[]);
    edges.forEach((node,nodeIndex)=>node.forEach(edge=>inverseEdges[edge].push(nodeIndex)));
    return inverseEdges;
}
export function equals(g1:Graph){
    return (g2:Graph)=>
        g1.nodes.length===g2.nodes.length 
        && g1.edges.length === g2.edges.length
        && g1.nodes.every((nd1)=>g2.nodes.some(nd2=>nd1.id===nd2.id))
        && g1.edges.every((node,nodeIndex)=>
            node.every((edge)=>g2.edges[nodeIndex].includes(edge))
        )
}