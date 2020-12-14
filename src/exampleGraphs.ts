import {Graph,s} from './graph';
export const incorrectGraphLessEdges:Graph={
    nodes:[s(11),s(12),s(13),s(14)],
    edges:[[1,2],[2],[]]
}
export const knownGraph:Graph={
    nodes:[s(11),s(12),s(13),s(14)],
    edges:[[1,2],[2],[],[]]
}
export const simpleGraph:Graph ={
    nodes:[s(100),s(101),s(102),s(103),s(204),s(205),s(306)],
    edges:[[4],[4],[5],[5],[6],[6],[]]
} 
export const graphWithBlindSpots = {
    nodes:[s(10),s(11),s(12),s(13),s(14)],
    edges:[[],[],[],[],[]]
}
export const simpleWithUpgrade:Graph={
    nodes:[s(100),s(101),s(102),s(103),s(204),s(205),s(306)],
    edges:[[4,1],[4,0],[5,1],[5,0],[6,1],[6,1],[]]
}
export const simpleWithExtension:Graph={
    nodes:[s(100),s(101),s(102),s(103),s(204),s(205),s(206),s(307)],
    edges:[[4],[5],[5],[6],[7],[4,6],[7],[]]
}
export const simpleWithExtensionAndUpgrade:Graph={
    nodes:[s(100),s(101),s(102),s(103),s(204),s(205),s(206),s(307)],
    edges:[[4,1],[5,0],[5,1],[6,0],[7,1],[4,6],[7,1],[]]
}
export const all = [knownGraph,simpleGraph,graphWithBlindSpots,simpleWithUpgrade,simpleWithExtension,simpleWithExtensionAndUpgrade]