import primitiveTypes from './types/primitiveTypes.js';
import structuralTypes from './types/structuralTypes.js';
import otherTypes from './types/otherTypes.js';
import JSON5 from '../vendor/json5.min.js';

try { !!window } catch (e){ structuralTypes.push('Buffer') }

class Checker {

    #error = null;
    #typeValue = null;
    #interfaces = {};

    #typeError(params, typeError = true ) {
        if(typeError) throw new TypeError(this.errorMsg(params));
        return false;
    }

    #proxyIs = new Proxy(this, {
        get(target, name) {
            target.#error = this.swap;
            target.#typeValue = name;
            return new Proxy(()=> 0, { apply: target.#applyIs.bind(target) })
        }
    });

    #proxySet = new Proxy(this, {
        get(target, name) {
            this.lastType = name;
            return this[name] ? this[name]: new Proxy(()=> 0, { apply: target.#setApply.bind(this) });
        },
        set(target, prop, value) {
            this.variables.forEach((varName, idx)=> {
                if(varName === prop) {
                    target.#error = !this.swap;
                    target.check(value, this.types[idx], Checker.defineMethod(this.types[idx]));
                    this[prop] = value;
                }
            })
            return true;
        }
    });

    #setApply(func, target, [value]) {
        if(Array.isArray(value)) {
            !this.types ? this.types = [this.lastType] : this.types.push(this.lastType);
            !this.variables ? this.variables = [value[0]]
                : Checker.duplicateError(value[0], this.variables) || this.variables.push(value[0]);
            return target;
        }
    }

    #proxyAs = new Proxy(this, {
        get(target, name) {
            target.#typeValue = name;
            target.#error = !target.swap;
            return new Proxy(()=> name, { apply: target.#apply.bind(target)});
        },
        set(target, prop, value) {
            target.interCheck(value, target.#interfaces[prop]);
            return value;
        }
    });

    #applyIs(target, thisVal, [value]) {
        let result = this.#apply(target, thisVal, [value]);
        result = [undefined,  0, 0n, '', null, NaN].includes(result) || !!result;
        return result;
    }

    #apply(target, thisVal, [value]) {
        let method4type;
        method4type = Checker.defineMethod(target() || this.#typeValue);
        let returned;
        switch (true){
            case !method4type && !!Checker.multiCheck(value, target() || this.#typeValue).length: {
                method4type = 'multiType';
                returned = this.check(value, target() || this.#typeValue, method4type);
            }
                break;
            case Object
                .keys(this.integrate)
                .includes(target() || this.#typeValue): returned = this.integrate[target() || this.#typeValue](value);
                break;
            case ['Any', 'any'].includes(target()) || ['Any', 'any'].includes(this.#typeValue): {
                    method4type = 'any';
                    returned = this.check(value, target() || this.#typeValue, method4type);
                }
            break;
            case method4type === undefined: {
                    this.#typeValue = `class:${target() || this.#typeValue}`;
                    method4type = 'class';
                    returned = this.check(value, target() || this.#typeValue, method4type);
                }
            break;
            default:
                returned = this.check(value, target() || this.#typeValue, method4type);
        }
        return returned;
    };

    constructor(integrate={}) {
        this.integrate = integrate;
        this.errorMsg = (params)=> `${params[2] || (params[0]?.constructor 
                ? params[0].constructor.name
                :params[0])
        } is not a(an) ${params[1]}`;
        this.swap = false;
        this.is = this.#proxyIs;
        this.IF = this.#proxyIs;
        this.ELSE = this.#proxyIs;
        this.END = null;
        this.strict = this.#proxySet;
        this.as = this.#proxyAs;
        this.Interface = function (object) {
            this.as.Object(object);
            Object.assign(this.#interfaces, object);
            return this.#interfaces;
        }.bind(this);
        this.interCheck = (src, interface_)=> {
            const srcKeys = Object.keys(src);
            const interfaceKeys = Object.keys(interface_).filter((item)=> item !== 'constructor');
            const correctProperty = srcKeys.filter((property)=> interfaceKeys.includes(property));
            if( srcKeys.length !==  interfaceKeys.length ||srcKeys.length !== correctProperty.length)
                throw TypeError(`${ JSON5.stringify(src) } invalid number of interface properties`);
            correctProperty.forEach((item)=> interface_[item](src[item]));
            return src;
        }

        this.multi = (typeList)=> {
            if(!Array.isArray(typeList) || typeList.length !== 1)
                throw new SyntaxError(`as-is Syntax Error ${typeList} isn't array with one string`);
            return this.as[typeList[0]]
        }
    }

    check(...params) {
        const [ arg, $type, ruleName ] = params;
        const checkedValue = Checker[ruleName].bind(this)(params);
        let result = ([undefined, 0, 0n, '', null, NaN].includes(checkedValue) || !!checkedValue)
            ? arg
            : false;
        if(this.#error) return result !== false ? result: this.#typeError([arg, $type]);
        else return result;
    }

    static any(value) {
        return value;
    }

    static multiCheck(value, typeValue){
        return primitiveTypes
            .concat(structuralTypes)
            .concat(otherTypes.map((type)=> type.alias).flat(1))
            .filter((type)=> typeValue.toLowerCase().includes(type.toLowerCase()) ? type: null);
    }

    static multiType(params) {
        const [arg, $type] = params;
        const error = this.#error;
        const type4Checking = Checker.multiCheck(arg, $type);
        const checked =  type4Checking.length ? type4Checking.filter((type)=> this.is[type](arg) !== false): null;
        this.#error = error;
        return checked?.length ? arg: false;
    }

    static defineMethod($type) {
        let method4type;
        const [otherTypesResult] = otherTypes.filter((item)=> item.alias.includes($type));
        switch(true){
            case primitiveTypes.map((item)=> item.toLowerCase())
                .includes($type): method4type = 'primitive';
                break;
            case primitiveTypes.map((item)=> item)
                .includes($type): method4type = 'primitive';
                break;
            case !!otherTypesResult?.method4type: method4type = otherTypesResult?.method4type;
                break;
            case structuralTypes.map((item)=> item.toLowerCase())
                .includes($type): method4type = `structural`;
                break;
            case structuralTypes.map((item)=> item)
                .includes($type): method4type = `structural`;
                break;
            case $type.split(':')[0] === 'class': method4type = `class`;
                break;
            case $type.endsWith('s') && primitiveTypes.map((item)=> item.toLowerCase())
                .includes($type.slice(0, -1)): method4type = 'numerous';
                break;
            case $type.endsWith('s') && primitiveTypes.map((item)=> item)
                .includes($type.slice(0, -1)): method4type = 'numerous';
                break;

        }
        return method4type;
    }

    static duplicateError(challenger, collection) {
        if(collection.includes(challenger)) throw new Error(`${challenger} has a duplicate`)
        return false
    }

    static numerous(params) {
        const [arg, $type] = params;
        Checker.notEmpty([arg]) ||  this.#typeError([arg, $type]);
        let collection;
        switch (arg.constructor.name.toLowerCase()) {
            case 'object': collection = Object.values(arg);
                break;
            default:
                collection = arg;
        }
        collection.forEach((item)=> {
            const method = Checker.defineMethod($type.slice(0, -1));
            Checker[method]([item, $type.slice(0, -1)]);
        });
        return arg;
    }

    static primitive(params) {
        const [arg, $type] = params;
        return (typeof arg === $type.toLowerCase());
    }

    static array(params) {
        const [arg] = params;
        return Array.isArray(arg);
    }

    static json(params) {
        const [arg] = params;
        let meOut = true;
        try { JSON.parse(arg) } catch(e) { meOut = false }
        return meOut;
    }

    static json5(params) {
        const [arg] = params;
        let meOut = true;
        try { JSON5.parse(arg) } catch(e) { meOut = false }
        return meOut;
    }

    static empty(params) {
        const [arg] = params;
        let meOut;
        switch (true) {
            case Checker.structural([arg, 'object']): meOut = !Object.keys(arg).length;
                break;
            case Checker.structural([arg, 'map']): meOut = !arg.size;
                break;
            case Checker.structural([arg, 'set']): meOut = !arg.size;
                break;
            case arg?.length === 0: meOut = true;
                break;
        }
        return !!meOut;
    }

    static notEmpty(params) {
        const [arg] = params;
        let meOut;
        switch (true) {
            case Checker.structural([arg, 'object']) && !!Object.keys(arg).length: meOut = true;
                break;
            case Checker.structural([arg, 'set']) && !!arg.size: meOut = true;
                break;
            case Checker.structural([arg, 'map']) && !!arg.size: meOut = true;
                break;
            case arg?.length > 0: meOut = true;
                break;
        }
        return !!meOut;
    }

    static date(params) {
        const [arg] = params;
        return arg instanceof Date;
    }

    static null(params) {
        const [arg] = params;
        return arg === null;
    }

    static structural(params) {
        const [arg, $type] = params;
        return !!arg?.constructor && arg.constructor.name.toLowerCase() === $type.toLowerCase();
    }

    static class(params) {
        const [arg, $type] = params;
        const standartTypes = primitiveTypes.concat(structuralTypes).concat(otherTypes.map((type)=> type.alias).flat(1))
        let meOut = (!arg && ![undefined, 0, 0n, '', null, NaN].includes(arg))
            || !$type
            || (arg?.name === $type.split(':')[1] && ![undefined, 0, 0n, '', null, NaN].includes(arg?.name))
            || (arg?.constructor?.name === $type.split(':')[1] && ![undefined, 0, 0n, '', null, NaN].includes(arg?.constructor?.name))
            || (arg?.prototype?.constructor?.name === $type.split(':')[1] && arg?.prototype?.constructor?.name !== undefined)
            || (!standartTypes.includes(arg?.constructor?.name) && ![undefined, 0, 0n, '', null, NaN].includes(arg?.constructor?.name))
            || (!standartTypes.includes(arg?.prototype?.constructor?.name) && arg?.prototype !== undefined)

        return meOut;
    }
}

class BaseInterface {
    constructor(otherClass = BaseInterface) {
        const meOut = {};
        Object
            .getOwnPropertyNames(otherClass.prototype)
            .filter((item)=> item !== 'constructor' )
            .forEach((property)=> meOut[property] = otherClass.prototype[property]());

        Object
            .getOwnPropertyNames(otherClass)
            .filter((item)=> !['length', 'name', 'prototype'].includes(item))
            .forEach((property)=> meOut[property] = otherClass[property]());
        return meOut;
    }
}

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

export { Checker, BaseInterface, Enum, JSON5 };
