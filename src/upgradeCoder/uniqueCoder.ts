import { numberFromURLCode, numberToURLCode } from "../urlHandler";
export function encodeUpgrades(edgesToFirstTierOnly:number[][]){
    return edgesToFirstTierOnly.map((edge,index)=>edge.length>0?edge[0]:index).map(numberToURLCode)
}
export function decodeUpgrades(coded:string[]){
    return coded.map(numberFromURLCode).map((val,index)=>(val===index?[]:[val]) as number[])
}