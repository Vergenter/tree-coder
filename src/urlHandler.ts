
export const SEPARATOR = "_";
import {id} from './graph'
export const LOWCHAR = "0";
export function numberToURLCode(num:number){
    return num.toString();
}
export function numberFromURLCode(code:string){
    return Number.parseInt(code,10);
}
export function SkillToURLCode(num:id):string{
    return numberToURLCode(num);
}
export function SkillFromURLCode(code:string):id{
    return numberFromURLCode(code);
}
export function idToURLCode(num:id):string{
    return numberToURLCode(num);
}
export function idFromURLCode(code:string):id{
    return numberFromURLCode(code);
}
export function idEquals(id1:id){
    return (id2:id)=> id1===id2;
}