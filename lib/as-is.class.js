import BaseInterface from './classes/BaseInterface.js';
import MicroTest from './classes/MicroTest.js';
import { Checker, primitiveTypes, structuralTypes, otherTypes, aliasTypes, JSON5 } from './classes/Checker.js';

try { !!window } catch (e){ structuralTypes.push('Buffer'); structuralTypes.push('SharedArrayBuffer') }

const handler = new Proxy(()=> null, {
    apply(func, target, [value]) {
        this.stop = { inc: true, dec: true };
        this.container = new class Enum { constructor() { return this } };
        this.step = value['Enum.step'] || 1;
        if(!Checker.structural([value, 'object'])) throw new TypeError('Enum can only be an object');
        const keys = Object.keys(value).filter((keys)=> !['Enum.step'].includes(keys));
        const inc = keys.filter((key)=> value[key]==='Enum.inc');
        const dec = keys.filter((key)=> value[key]==='Enum.dec');
        keys.forEach((key)=> {
            value[key]==='Enum.inc' && this.stop.inc && inc.length && this.calc({ value, keys, inc, func: 'inc' });
            value[key]==='Enum.dec' && this.stop.dec && dec.length && this.calc({ value, keys, dec, func: 'dec' });
        });
        keys.forEach((key)=> !inc.includes(key) && !dec.includes(key) && (this.container[value[key]]= key));
        Object.freeze(this.container);
        return this.container;
    },
    calc(params) {
        let {value, keys, func, start = this.step} = params;
        if(this.stop[func]) {
            this.stop[func] = false;
            keys.forEach((key)=> {
                if(params[func].includes(key)){
                    this.container[key]= start;
                    this.container[this.container[key]]= key;
                    func === 'inc'
                        ? start += this.step
                        : start -= this.step;
                } else {
                    func === 'inc'
                        ? (Checker.primitive([value[key], 'number']) && (start = value[key] + this.step))
                        : (Checker.primitive([value[key], 'number']) && (start = value[key] - this.step));
                    this.container[key] === undefined && (this.container[key]= value[key]);
                }
            });
        }
    }
});

const Enum = new Proxy(handler, {
    get(target, name) {
        let meOut;
        switch(name) {
            case 'step': case 'inc': case 'dec': meOut = `Enum.${name}`;
                break;
            case 'init': meOut = handler;
                break;
        }
        return meOut;
    }
})

export { Checker, BaseInterface, Enum, JSON5, MicroTest, primitiveTypes, structuralTypes, otherTypes, aliasTypes };
