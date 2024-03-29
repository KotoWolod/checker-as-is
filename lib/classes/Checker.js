import JSON5 from '../../vendor/json5.min.js';
import primitiveTypes from '../types/primitiveTypes.js';
import structuralTypes from '../types/structuralTypes.js';
import otherTypes from '../types/otherTypes.js';
import aliasTypes from '../types/aliasTypes.js';

const type = (arg)=> {
    const primitive = primitiveTypes.filter((type)=> Checker.primitive([arg, type]))
    const structural = structuralTypes.filter((type)=> Checker.structural([arg, type]))
    const other = otherTypes.filter((type)=> {
        type === 'class'
            ? Checker[type.method4type]([arg, type])
            : Checker[type.method4type]([arg, type.method4type])
    })
    const type = [...primitive, ...structural, ...other].filter((item)=> item)[0];

    let meOut;
    if(type === 'Function' && arg.prototype?.constructor?.name)
        meOut = arg.prototype.constructor.name;
    else if(type === undefined && arg?.constructor?.name)
        meOut =  arg.constructor.name;
    else
        meOut = type;
    return meOut;
}


export default class Checker {

    #error = null;
    #typeValue = null;
    #interfaces = {};

    #typeError(params, typeError = true ) {
        if(typeError) throw new TypeError(this.errorMsg(params));
        return false;
    }

    #optionalAs = new Proxy(this, {
        get(target, name) {
            target.#typeValue = `UndefinedNull${name}`;
            name = target.#typeValue;
            target.#error = !target.swap;
            return new Proxy(()=> name, { apply: target.#apply.bind(target)});
        },
        set(target, prop, value) {
            target.interCheck(value, target.#interfaces[prop]);
            return value;
        }
    });

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
        result = Checker.nullish([result]) || !!result;
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

    constructor(integrate = {}) {
        this.errorMsg = (params)=> `${params[2] || (params[0]?.constructor
            ? params[0].constructor.name
            :params[0])
        } is not a(an) ${params[1]}`;
        this.disabled = false;
        this.is = this.#proxyIs;
        this.optional = this.#optionalAs;
        this.IF = this.#proxyIs;
        this.ELSE = this.#proxyIs;
        this.END = null;
        this.strict = this.#proxySet;
        this.as = this.#proxyAs;
        this.get = { type };
        this.integrate = Object.assign(integrate);
        Object.keys(integrate)
            .forEach((key)=> this.is.function(this.integrate[key])
                && (this.integrate[key]= this.integrate[key].bind(this)));
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
        let result = (Checker.nullish([checkedValue]) || !!checkedValue)
            ? (arg === undefined && !Checker.primitive([checkedValue, 'boolean']) || arg === false ? checkedValue: arg)
            : false;
        if(this.#error) return result !== false ? result: this.#typeError([arg, $type]);
        else return result?.name !==this.constructor.name ? result: {};
    }

    static alias(params) {
        const [arg, $type] = params;
        let meOut = false;
        switch (true){
            case $type.toLowerCase() === 'argument': meOut = Checker.multiType.bind(this)([arg, 'ArrayObject']);
                break
            case $type.toLowerCase() === 'iterable': meOut = Checker.multiType.bind(this)([arg, 'iteratorObjectSymbol'])
                break
            case $type.toLowerCase() === 'generator': meOut = Checker.structural.bind(this)([arg, 'GeneratorFunction'])
                break
            case $type.toLowerCase() === 'promise': meOut = Checker.class.bind(this)([arg, $type])
                break

        }
        return meOut;
    }

    static CheckPlatform(params, platform) {
        return Checker.structural([globalThis[platform], platform]);
    }

    static iterator(params) {
        const [arg] = params;
        return !!arg?.[Symbol.iterator] || !!arg?.[Symbol.asyncIterator];
    }

    static nullish(params) {
        const [arg] = params;
        return [undefined, 0, 0n, '', null, NaN].includes(arg)
    }

    static bun(params) {
        const node = Checker.node(params);
        return node?.isBun ? node: false;
    }

    static browser(params) {
        let result = Checker.CheckPlatform(params, 'navigator');
        return  result ? window.navigator: result;
    }

    static browserFromList(params) {
        const [$type] = params;
        let meOut = Checker.CheckPlatform(params, 'navigator');
        meOut && (meOut = window.navigator.userAgent
            .includes($type.replace(/./, firstLetter => firstLetter.toUpperCase())) && window.navigator);
        return meOut;
    }

    static node(params) {
        let result = Checker.CheckPlatform(params, 'process');
        result = result && process?.release?.name === 'node';
        return  result ? process: result;
    }

    static any(value) {
        return value;
    }

    static multiCheck(value, typeValue){
        let meOut = primitiveTypes
            .concat(structuralTypes)
            .concat(otherTypes.map((type)=> type.alias).flat(1))
            .filter((type)=> typeValue.toLowerCase().includes(type.toLowerCase()) ? type: null);
        return meOut;
    }

    static multiType(params) {
        const [arg, $type] = params;
        const error = this.#error;
        const type4Checking = Checker.multiCheck.bind(this)(arg, $type);
        const checked =  type4Checking.length ? type4Checking.filter((type)=> this.is[type](arg) !== false): null;
        this.#error = error;
        return checked?.length ? arg: false;
    }

    static defineMethod($type) {
        let method4type;
        const [otherTypesResult] = otherTypes.filter((item)=> item.alias.includes($type));
        const [aliasTypeResult] = aliasTypes.filter((item)=> item.alias.includes($type));
        switch(true){
            case primitiveTypes.map((item)=> item.toLowerCase())
                .includes($type): method4type = 'primitive';
                break;
            case primitiveTypes.map((item)=> item)
                .includes($type): method4type = 'primitive';
                break;
            case !!otherTypesResult?.method4type: method4type = otherTypesResult?.method4type;
                break;
            case !!aliasTypeResult?.method4type: method4type = aliasTypeResult?.method4type;
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
        let meOut = (!arg && !Checker.nullish([arg]))
            || !$type
            || (arg?.name === $type.split(':')[1] && !Checker.nullish([arg?.name]))
            || (arg?.constructor?.name === $type.split(':')[1] && !Checker.nullish([arg?.constructor?.name]))
            || (arg?.prototype?.constructor?.name === $type.split(':')[1] && arg?.prototype?.constructor?.name !== undefined)
            || (!standartTypes.includes(arg?.constructor?.name) && !Checker.nullish([arg?.constructor?.name]))
            || (!standartTypes.includes(arg?.prototype?.constructor?.name) && arg?.prototype !== undefined)
            || ((Object.getPrototypeOf(arg))?.constructor.name === $type.split(':')[1]
                && !Checker.nullish([(Object.getPrototypeOf(arg))?.constructor.name]))

        return meOut;
    }
}

export { JSON5, primitiveTypes, structuralTypes, otherTypes, aliasTypes, Checker }
