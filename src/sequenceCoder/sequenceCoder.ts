import {numberToURLCode,numberFromURLCode,LOWCHAR} from "../urlHandler"
import {map,cons} from 'fp-ts/Array'
import {pipe} from 'fp-ts/lib/function'
function padLeft(lenght:number){
    return (id:string)=>String(LOWCHAR).repeat(lenght - id.length)+id;
}
export function encodeSequence(encodedElements:string[]){
    const maxDataSize = encodedElements.reduce((prev,curr)=>curr.length>prev?curr.length:prev,0);
    return pipe(encodedElements,
        map(padLeft(maxDataSize)),
        cons(numberToURLCode(maxDataSize)),
    ).join('');
}
export function decodeSequence(sequence:string):string[]{
    const dataSize = numberFromURLCode(sequence[0]);
    return sequence.substr(1).match(new RegExp(`.{${dataSize}}`,'g'));
}