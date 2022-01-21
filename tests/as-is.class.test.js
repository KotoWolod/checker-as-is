import { mocha, describe, it, expect, before } from './header.js';
import Checker from '../index.js';
const tc = new Checker();
const { multi, Strict, type, as, is } = tc;

const string_ = '';
const number_ = 2;
const boolean_ = true;
const symbol_ = Symbol('test');
const function_ = function(){};
const bigInt_ = BigInt("1234567890123456789012345678901234567890");
const undefined_ = undefined;
const null_ = null;
const array_ = [];
const date_ = new Date();
const object_ = {};
const set_ = new Set();
const map_ = new Map();
const weakSet_ = new WeakSet();
const weakMap_ = new WeakMap();
const weakRef_ = new WeakRef(object_);
const regExp_ = new RegExp(/./g);
const buffer_ = new Buffer.alloc(5);
const promise_ = new Promise((_)=> _);
const json_ = JSON.stringify({test: 'test'});
const json5_ = "{property: 'value'}";
const error_ = new Error('this is error');
const rangeError_ = new RangeError('this is RangeError');
const referenceError_ = new ReferenceError('this is ReferenceError');
const syntaxError_ = new SyntaxError('this is SyntaxError');
const typeError_ = new TypeError('this is TypeError');
const checker_ = new Checker();

const exampleObject = {};
new Array(10).fill(0).forEach((_, idx)=> Object.assign(exampleObject, {[`prop${idx}`]:string_}));
const exampleArray = [...Array(10).keys(10)]
const exampleSet = new Set(exampleArray);
const exampleMap = new Map();
Object.keys(exampleObject).forEach((item)=> exampleMap.set(item, exampleObject[item]));

const typeof_ = [string_, number_, boolean_, symbol_, function_, bigInt_];
const special_ = [ array_, date_, object_, set_, map_, weakSet_, weakMap_, weakRef_,
    regExp_, buffer_, promise_, json_, json5_, error_, rangeError_, referenceError_, syntaxError_, typeError_,
    checker_];
const numerous_ = typeof_.concat(special_.slice(-1));

describe('strict-type-checker tests', function () {
    this.timeout(0);

    it('typeof positive tests', () => {
        const value = is.string(string_);
        is.string(string_) && as.string(string_);
        is.String(string_) && as.String(string_);
        is.number(number_) && as.number(number_);
        is.Number(number_) && as.Number(number_);
        is.boolean(boolean_) && as.boolean(boolean_);
        is.Boolean(boolean_) && as.Boolean(boolean_);
        is.bigInt(boolean_) && as.bigInt(boolean_);
        is.BigInt(boolean_) && as.BigInt(boolean_);
        expect(value).to.be.equal(string_);
        expect(is.string(string_)).to.be.equal(string_);
        expect(is.String(string_)).to.be.equal(string_);
        expect(is.number(number_)).to.be.equal(number_);
        expect(is.Number(number_)).to.be.equal(number_);
        expect(is.boolean(boolean_)).to.be.equal(boolean_);
        expect(is.Boolean(boolean_)).to.be.equal(boolean_);
        expect(is.BigInt(bigInt_)).to.be.equal(bigInt_);
    });

    it('special positive tests', () => {
        is.undefined(undefined_) && as.undefined(undefined_);
        is.null(null_) && as.null(null_);
        is.array(undefined_) && as.array(undefined_);
        is.array(array_) && as.array(array_);
        is.date(date_) && as.date(date_);
        is.object(object_) && as.object(object_);
        is.set(set_) && as.set(set_);
        is.map(map_) && as.map(map_);
        is.WeakSet(weakSet_) && as.WeakSet(weakSet_);
        is.WeakMap(weakMap_) && as.WeakMap(weakMap_);
        is.WeakRef(weakRef_) && as.WeakRef(weakRef_);
        is.RegExp(regExp_) && as.RegExp(regExp_);
        is.error(error_) && as.error(error_);
        is.RangeError(rangeError_) && as.RangeError(rangeError_);
        is.ReferenceError(referenceError_) && as.ReferenceError(referenceError_);
        is.SyntaxError(syntaxError_) && as.SyntaxError(syntaxError_);
        is.TypeError(typeError_) && as.TypeError(typeError_);
        is.buffer(buffer_) && as.buffer(buffer_);
        is.promise(promise_) && as.promise(promise_);
        is.json(json_) && as.json(json_);
        is.json5(json5_) && as.json5(json5_);
        is.Checker(checker_) && as.Checker(checker_);
        is.Checker(Checker) && as.Checker(Checker);
        expect(is.array(array_)).to.be.equal(array_);
        expect(is.date(date_)).to.be.equal(date_);
        expect(is.object(object_)).to.be.equal(object_);
        expect(is.set(set_)).to.be.equal(set_);
        expect(is.map(map_)).to.be.equal(map_);
        expect(is.WeakSet(weakSet_)).to.be.equal(weakSet_);
        expect(is.WeakMap(weakMap_)).to.be.equal(weakMap_);
        expect(is.WeakRef(weakRef_)).to.be.equal(weakRef_);
        expect(is.RegExp(regExp_)).to.be.equal(regExp_);
        expect(is.error(error_)).to.be.equal(error_);
        expect(is.RangeError(rangeError_)).to.be.equal(rangeError_);
        expect(is.ReferenceError(referenceError_)).to.be.equal(referenceError_);
        expect(is.SyntaxError(syntaxError_)).to.be.equal(syntaxError_);
        expect(is.TypeError(typeError_)).to.be.equal(typeError_);
        expect(is.Buffer(buffer_)).to.be.equal(buffer_);
        expect(is.Buffer(buffer_)).to.equalBytes('0000000000');
        expect(is.Promise(promise_)).to.be.equal(promise_);
        expect(is.JSON(json_)).to.be.equal(json_);
        expect(is.JSON5(json5_)).to.be.equal(json5_);
        expect(is.Checker(checker_)).to.be.equal(checker_);
        expect(is.Checker(Checker)).to.be.equal(Checker);
    });

    it('validator positive tests', () => {
        is.empty(string_) && as.empty(string_);
        is.empty(array_) && as.empty(array_);
        is.empty(object_) && as.empty(object_);
        is.empty(set_) && as.empty(set_);
        is.empty(map_) && as.empty(map_);
        is.empty(weakSet_) && as.empty(weakSet_);
        is.empty(weakMap_) && as.empty(weakMap_);
        is.empty(weakRef_) && as.empty(weakRef_);
        is.empty(weakRef_) && as.empty(weakRef_);
        is.notEmpty(string_) && as.notEmpty('string_');
        is.notEmpty(exampleArray) && as.notEmpty(exampleArray);
        is.notEmpty(exampleObject) && as.notEmpty(exampleObject);
        is.notEmpty(exampleSet) && as.notEmpty(exampleSet);
        is.notEmpty(exampleMap) && as.notEmpty(exampleMap);
        is.notEmpty(weakSet_.add(object_)) && as.notEmpty(weakSet_.add(object_));
        is.notEmpty(weakMap_.set(object_, 1)) && as.notEmpty(weakMap_.set(object_, 1));
        is.notEmpty(new WeakRef({t:1})) && as.notEmpty(new WeakRef({t:1}));
    });

    it('Checking one repeated type string positive tests in object, array, set and map', () => {
        is.strings(exampleObject) && as.strings(exampleObject);
        is.strings(exampleArray) && as.strings(exampleArray);
        is.strings(exampleSet) && as.strings(exampleSet);
        is.strings(exampleMap) && as.strings(exampleMap);
    });

    it('multi type positive tests', ()=> {
        as.NumberStringBooleanSymbolFunctionBigIntArrayDateObjectSetMapWeakSetWeakMapWeakRefRegExpPromiseErrorRangeErrorReferenceErrorSyntaxErrorTypeErrorArrayDateNotEmptyEmptyJsonJson5Checker(2);
        as.Number_String_Boolean_Symbol_Function_BigInt_Array([]);
        as['Number|String|Boolean']('text');
        is['Number-String-Boolean'](true);
        as['Number or String or Boolean'](777);
        as['it can be any text with type definition like String or Number'](111);

        multi`Number|String|Boolean`(2022);
        multi(['Number|String|Boolean'])(true);

        const multiType = 'Number|String|Boolean';
        as[multiType](1);
    });

    it('Strict positive testing', ()=> {
        const strict = new Strict(
            type.string`name`,
            type.number`age`,
            type.strings`pages`
        );
        strict.name = 'Mike';
        strict.age = 12;
        strict.pages = [''];
        strict.bla = 1;
        expect(strict.values()).to.deep.equal({ age: 12, name: "Mike", pages: [ '']});
        type.string`example`;
        strict.example = '2';
    })
});
