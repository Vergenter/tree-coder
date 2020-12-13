import {Graph,id,Skill} from '../graph';
import {zip,range} from 'fp-ts/Array'
import {SEPARATOR,numberFromURLCode,numberToURLCode,idEquals, LOWCHAR} from '../urlHandler'
export function encodeDAG(edges:number[][]):number[][]{
    let arr = zip(edges)(range(0,edges.length-1))
    const result=Array<number[]>(edges.length-1);
    for(let i=edges.length-2;i>=0;i--){
        const u = arr.find(el=>el[1].length === 0);
        result[i] = arr.reduce((prev,curr)=>prev.concat(curr[1].some(idEquals(u[0]))?[curr[0]]:[]),[]);
        arr = arr.filter(elem=>elem!=u);
        arr.forEach(elem=>{elem[1]=elem[1].filter(conn=>conn!=u[0])});
    }
    return result;
}
export function decodeDAG(decodedEdges:number[][]){
    const result=Array<number[]>(decodedEdges.length+1).fill([]);
    let S = (range(0,decodedEdges.length))
    for(let i=decodedEdges.length-1;i>=0;i--){
        const s = S.filter(sval=>!decodedEdges.some((val,idx)=>idx<=i&&val.some(inval=>sval===inval)))[0];
        decodedEdges[i].forEach(edge=>{result[edge]=result[edge].concat(s)})
        S = S.filter(val=>val!=s)
    }
    return result;
}

