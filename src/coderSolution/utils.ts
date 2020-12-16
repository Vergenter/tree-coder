import { Graph } from "../graph";

/**
 * 
 * @return [noEdgesToFirstTier,withEdgesToFirstTier]
 */
export function splitGraph(graph:Graph):[Graph,Graph]{
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