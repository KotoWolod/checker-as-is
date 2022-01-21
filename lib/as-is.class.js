import typeofTypes from './types/typeofTypes.js';
import specialTypes from './types/specialTypes.js';
import otherTypes from './types/otherTypes.js';
import JSON5 from '../vendor/json5.min.js';

try { !!window } catch (e){ specialTypes.push('Buffer') }

class Checker {

    #error = null;
    #typeValue = null;
    #interfaces = {};

    #typeError(params, typeError = true ) {
        if(typeError) throw new TypeError(this.errorMsg(params));
        return false;
    }

    #proxyIs = new Proxy(this, { get(target, name) {
        target.#error = this.swap;
        target.#typeValue = name;
        return new Proxy(()=> 0, { apply: target.#apply.bind(target)});
    }});

    #proxySet = new Proxy(this, {
        get(target, name) {
            this.values = ()=> {
                const resultObj = {};
                Object.keys(this)
                    .forEach((key)=> ['get', 'set', 'values', 'types', 'variables', 'lastType']
                        .includes(key) || (resultObj[key] = this[key]));
                return resultObj;
            };
            this.lastType = name;
            return this[name] ? this[name]: new Proxy(()=>0, { apply: target.#setApply.bind(this) });
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

    #proxyAs = new Proxy(this, { get(target, name) {
        target.#typeValue = name;
        target.#error = !target.swap;
        return new Proxy(()=> name, { apply: target.#apply.bind(target)});
    },
    set(target, prop, value) {
        target.interCheck(value, target.#interfaces[prop]);
        return value;
    }
    });


    #apply(target, thisVal, [value]) {
        let method4type;
        if(value === undefined || value === null) {
            method4type = `null`;
        } else method4type = Checker.defineMethod(target() || this.#typeValue);
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
        this.type = this.#proxySet;
        this.as = this.#proxyAs;
        this.Strict = Object;
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
        const [arg, $type, ruleName] = params;
        const result = Checker[ruleName].bind(this)(params) ? arg: false;
        if(this.#error) return result ? result: this.#typeError([arg, $type]);
        else return result;
    }

    static any(value) {
        return value;
    }

    static multiCheck(value, typeValue){
        return typeofTypes
            .concat(specialTypes)
            .concat(otherTypes)
            .filter((type)=> typeValue.includes(type) ? type: null);
    }

    static multiType(params) {
        const [arg, $type] = params;
        const error = this.#error;
        const type4Checking = Checker.multiCheck(arg, $type);
        const checked =  type4Checking.length ? type4Checking.filter((type)=> this.is[type](arg)): null;
        this.#error = error;
        return checked?.length ? arg: false;
    }

    static defineMethod($type) {
        let method4type;
        const otherTypesResult = otherTypes.filter((item)=> item.alias.includes($type))[0];
        switch(true){
            case typeofTypes.map((item)=> item.toLowerCase())
                .includes($type): method4type = 'typeof';
                break;
            case typeofTypes.map((item)=> item)
                .includes($type): method4type = 'typeof';
                break;
            case !!otherTypesResult?.method4type: method4type = otherTypesResult?.method4type;
                break;
            case specialTypes.map((item)=> item.toLowerCase())
                .includes($type): method4type = `constructorTc`;
                break;
            case specialTypes.map((item)=> item)
                .includes($type): method4type = `constructorTc`;
                break;

            case $type === undefined || $type === 'undefined': method4type = `undefined`;
                break;
            case $type.split(':')[0] === 'class': method4type = `class`;
                break;
            case $type.endsWith('s') && typeofTypes.map((item)=> item.toLowerCase())
                .includes($type.slice(0, -1)): method4type = 'numerous';
                break;
            case $type.endsWith('s') && typeofTypes.map((item)=> item)
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
        Checker.notEmpty(arg) ||  this.#typeError([arg, $type]);
        let collection;
        switch (arg.constructor.name.toLowerCase()) {
            case 'object': collection = Object.values(arg);
                break;
            default:
                collection = arg;
        }
        collection.forEach((item)=> {
            const method = Checker.defineMethod($type.slice(0, -1))
            Checker[method]([item, $type.slice(0, -1)])
        });
        return arg;
    }

    static typeof(params){
        const [arg, $type] = params;
        return (typeof arg === $type.toLowerCase());
    }

    static undefined(...params) {
        const [arg, $type] = params;
        return (arg !== undefined && typeof arg !== $type)
    }

    static null(...params) {
        const [arg, $type] = params;
        return (arg!== $type);
    }

    static array(...params) {
        const [arg] = params;
        return Array.isArray(arg);
    }

    static json(params) {
        const [arg] = params;
        let out = true;
        try { JSON.parse(arg) } catch(e) { out = false }
        return out;
    }

    static json5(params) {
        const [arg] = params;
        let out = true;
        try { JSON5.parse(arg) } catch(e) { out = false }
        return out;
    }

    static empty(params) {
        const [arg] = params;
        let out;
        switch (true){
            case !arg?.length: out = true;
                break;
            case Checker.constructorTc([arg, 'object']) && !Object.keys(arg).length: out = true;
                break;
            case Checker.constructorTc([arg, 'set']) && !arg.size: out = true;
                break;
        }
        return out;
    }

    static notEmpty(...params) {
        const [arg] = params;
        let out;
        switch (true){
            case arg?.length > 0: out = true;
                break;
            case Checker.constructorTc([arg, 'object']) && !!Object.keys(arg).length: out = true;
                break;
            case Checker.constructorTc([arg, 'set']) && !!arg.size: out = true;
                break;
            case Checker.constructorTc([arg, 'map']) && !!arg.size: out = true;
                break;
        }
        return out;
    }


    static date(...params) {
        const [arg] = params;
        return !(arg instanceof Date);
    }

    static constructorTc(params) {
        const [arg, $type] = params;
        return arg.constructor.name.toLowerCase() === $type.toLowerCase();
    }

    static class(params) {
        const [arg, $type] = params;
        return (arg
            && $type
            || arg?.name === $type.split(':')[1]
            || arg?.constructor?.name === $type.split(':')[1]
            || arg?.prototype?.constructor?.name === $type.split(':')[1]);
    }
}

class BaseInterface {
    constructor(otherClass = BaseInterface) {
        const out = {};
        Object
            .getOwnPropertyNames(otherClass.prototype)
            .filter((item)=> item !== 'constructor' )
            .forEach((property)=> out[property] = otherClass.prototype[property]());

        Object
            .getOwnPropertyNames(otherClass)
            .filter((item)=> !['length', 'name', 'prototype'].includes(item))
            .forEach((property)=> out[property] = otherClass[property]());
        return out;
    }
}

export { Checker, BaseInterface };
