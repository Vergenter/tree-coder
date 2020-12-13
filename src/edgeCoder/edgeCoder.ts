import { LOWCHAR, numberFromURLCode, numberToURLCode, SEPARATOR } from './../urlHandler';
function padLeft(lenght:number){
    return (id:string)=>String(LOWCHAR).repeat(lenght - id.length)+id;
}
function internalEncodeEdges(maxLenght:number){
    return (indexes:number[][])=>
        indexes.map(elements=>elements.map(numberToURLCode).map(padLeft(maxLenght)).join('')).join(SEPARATOR)
}
export function encodeEdges(edges:number[][]){
    const maxIndexSize = numberToURLCode(edges.length).length;
    return `${numberToURLCode(maxIndexSize)}${internalEncodeEdges(maxIndexSize)(edges)}`;
}
export function decodeEdges(coded:string){
    const indexSize = numberFromURLCode(coded[0])
    const regex = new RegExp(`.{${indexSize}}`,'g');
    const connections = coded.substr(1).split(SEPARATOR).map(
        edges=>edges.length?edges.match(regex).map(numberFromURLCode):[]
    )
    return connections;
}