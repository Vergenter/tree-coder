function convertBase(value:string, from_base:number, to_base:number) {
    var range = `0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-+`.split('');
    var from_range = range.slice(0, from_base);
    var to_range = range.slice(0, to_base);
    
    var dec_value = value.split('').reverse().reduce(function (carry, digit, index) {
      if (from_range.indexOf(digit) === -1) throw new Error('Invalid digit `'+digit+'` for base '+from_base+'.');
      return carry += from_range.indexOf(digit) * (Math.pow(from_base, index));
    }, 0);
    
    var new_value = '';
    while (dec_value > 0) {
      new_value = to_range[dec_value % to_base] + new_value;
      dec_value = (dec_value - (dec_value % to_base)) / to_base;
    }
    return new_value || '0';
}
export const SEPARATOR = "_";
import {id} from './graph'
export const LOWCHAR = "0";
export function numberToURLCode(num:number){
    return convertBase(num.toString(10),10,64);
}
export function numberFromURLCode(code:string){
    return Number.parseInt(convertBase(code,64,10),10);
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