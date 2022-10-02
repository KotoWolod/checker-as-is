export default class BaseInterface {
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
