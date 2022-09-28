import { mocha, describe, it, expect, before } from './header.js';
import { Checker, BaseInterface, Enum } from '../index.js';
import primitiveTypes from '../lib/types/primitiveTypes.js';
import structuralTypes from '../lib/types/structuralTypes.js';
import otherTypes from '../lib/types/otherTypes.js';

import MyInterface from './MyInterface.interface.js';

const tc = new Checker();
const { multi, Interface, Strict, type, as, is, IF, ELSE, END }  = tc;

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

const primitive_ = [string_, number_, boolean_, symbol_, function_, bigInt_];
const structural_ = [ array_, date_, object_, set_, map_, weakSet_, weakMap_, weakRef_,
    regExp_, buffer_, promise_, json_, json5_, error_, rangeError_, referenceError_, syntaxError_, typeError_,
    checker_];
const numerousValues_ = primitive_.concat(structural_.slice(-1));
const numerousTypes_ = primitiveTypes.concat(structuralTypes);
const withLengthEmpty = [string_, array_, object_, set_, map_];
const withLengthNotEmpty = ['string_', exampleArray, exampleObject, exampleSet, exampleMap];

describe('strict-type-checker tests', function () {
    this.timeout(0);

    it('if/else type checking', ()=> {
        IF.number(string_)? (
            console.log('IF type checking')
        ):ELSE.string(string_)? (
            console.log('ELSE type checking'),
            expect(string_).to.be.eq(string_)
        ):END;
    })

    it('typeof positive tests', () => {
        const value = as.string(string_);
        is.string(string_) && as.string(string_);
        is.String(string_) && as.String(string_);
        is.number(number_) && as.number(number_);
        is.Number(number_) && as.Number(number_);
        is.boolean(boolean_) && as.boolean(boolean_);
        is.Boolean(boolean_) && as.Boolean(boolean_);
        is.bigInt(bigInt_) && as.bigInt(bigInt_);
        is.BigInt(bigInt_) && as.BigInt(bigInt_);
        expect(value).to.be.equal(string_);
        expect(is.string(string_)).to.be.equal(true);
        expect(is.String(string_)).to.be.equal(true);
        expect(is.number(number_)).to.be.equal(true);
        expect(is.Number(number_)).to.be.equal(true);
        expect(is.boolean(boolean_)).to.be.equal(true);
        expect(is.Boolean(boolean_)).to.be.equal(true);
        expect(is.BigInt(bigInt_)).to.be.equal(true);
    });

    it('primitive negative tests', ()=> {
        primitiveTypes.forEach((type)=> primitive_.forEach((value)=> {
                function throwFn() { try { as[type](value) } catch (e) { throw e } }
                type.toLowerCase()!== typeof value && expect(throwFn).to.throw();
        }));
    });

    it('structural positive tests', () => {
        is.undefined(undefined_) && as.undefined(undefined_);
        is.null(null_) && as.null(null_);
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
        expect(is.array(array_)).to.be.equal(true);
        expect(is.date(date_)).to.be.equal(true);
        expect(is.object(object_)).to.be.equal(true);
        expect(is.set(set_)).to.be.equal(true);
        expect(is.map(map_)).to.be.equal(true);
        expect(is.WeakSet(weakSet_)).to.be.equal(true);
        expect(is.WeakMap(weakMap_)).to.be.equal(true);
        expect(is.WeakRef(weakRef_)).to.be.equal(true);
        expect(is.RegExp(regExp_)).to.be.equal(true);
        expect(is.error(error_)).to.be.equal(true);
        expect(is.RangeError(rangeError_)).to.be.equal(true);
        expect(is.ReferenceError(referenceError_)).to.be.equal(true);
        expect(is.SyntaxError(syntaxError_)).to.be.equal(true);
        expect(is.TypeError(typeError_)).to.be.equal(true);
        expect(is.Buffer(buffer_)).to.be.equal(true);
        expect(is.Buffer(buffer_)).to.equal(true);
        expect(is.Promise(promise_)).to.be.equal(true);
        expect(is.JSON(json_)).to.be.equal(true);
        expect(is.JSON5(json5_)).to.be.equal(true);
        expect(is.Checker(checker_)).to.be.equal(true);
        expect(is.Checker(Checker)).to.be.equal(true);
    });

    it('structural negative tests', ()=> {
        structuralTypes.forEach((type)=> structural_.forEach((value)=> {
            function throwFn() { try { as[type](value) } catch (e) { throw e } }
            value.constructor.name.toLowerCase() !== type.toLowerCase() && expect(throwFn).to.throw();
        }));
    });


    it('any positive tests', ()=> {
        primitive_.concat(structural_).forEach((value)=> expect(is.any(value)).to.be.equal(true));
    });

    it('validator positive tests', () => {
        is.empty(string_) && as.empty(string_);
        is.empty(array_) && as.empty(array_);
        is.empty(object_) && as.empty(object_);
        is.empty(set_) && as.empty(set_);
        is.empty(map_) && as.empty(map_);
        is.notEmpty(string_) && as.notEmpty('string_');
        is.notEmpty(exampleArray) && as.notEmpty(exampleArray);
        is.notEmpty(exampleObject) && as.notEmpty(exampleObject);
        is.notEmpty(exampleSet) && as.notEmpty(exampleSet);
        is.notEmpty(exampleMap) && as.notEmpty(exampleMap);
    });

    it('validator negative tests', ()=> {
       withLengthEmpty.forEach((value)=> {
            function throwFn() { try { as.notEmpty(value) } catch (e) { throw e } }
            type.toLowerCase()!== typeof value && expect(throwFn).to.throw();
        });
       withLengthNotEmpty.forEach((value)=> {
            function throwFn() { try { as.empty(value) } catch (e) { throw e } }
            type.toLowerCase()!== typeof value && expect(throwFn).to.throw();
        });

    });


    it('Checking one repeated type string positive tests in object, array, set and map', () => {
        is.strings(exampleObject) && as.strings(exampleObject);
        is.strings(exampleArray) && as.strings(exampleArray);
        is.strings(exampleSet) && as.strings(exampleSet);
        is.strings(exampleMap) && as.strings(exampleMap);
        primitiveTypes.forEach((type)=> primitive_.forEach((value)=> {
            const exampleMap = new Map();
            type.toLowerCase()=== typeof value && as[`${type}s`]([value]);
            type.toLowerCase()=== typeof value && as[`${type}s`]({prop: value});
            type.toLowerCase()=== typeof value && as[`${type}s`](new Set([value]));
            Object.keys({prop: value}).forEach((item)=> exampleMap.set(item, exampleObject[item]));
            type.toLowerCase()=== typeof value && as[`${type}s`](exampleMap);
        }));
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

    it('interfaces positive testing', ()=> {
        const { IUser, IBook } = Interface({
            IUser: {
                name: as.string,
                age: as.number,
                birthDate: as.date
            },
            IBook: {
                title: as.string,
                pages: as.number
            }
        });

        IUser.pages = as.strings;
        delete IUser.birthDate;

        as.IUser = { name: 'text', age: 12, pages:['page'] };

        function example(params, Interface = (as.IUser = params)) {
            console.log(params);
            return 'returned string';
        }

        function exampleSecond(params) {
            const { title, pages } = as.IBook = params;
            console.log(title, pages );
            return params
        }

        example({ name: 'text', age: 12, pages:['page'] });
        exampleSecond({ title: 'Book title', pages: 777});

        const intefaces = Interface({});

        const { IMyInterface } = Interface({ IMyInterface: new MyInterface });
        as.IMyInterface = { name: 'Tomas', age: '12', surName: 'Andersen' };
    });

    it('Enum tests positive/negative', ()=> {
        const enumExample = Enum.init({
                [Enum.step]: 1,
                Monday: 1,
                Tuesday: Enum.inc,
                Wednesday: Enum.dec,
                Thursday: Enum.inc,
                Friday: Enum.dec,
                Saturday: 'day off',
                Sunday: 'super day off'
        });

        console.log(enumExample, enumExample.Saturday);
        function throwFn() { try { enum01.notPossible = 'Realy ?' } catch (e) { throw e } }
        function throwENum() { try { as.Enum('not Enum') } catch (e) { throw e } }

        expect(throwFn).to.throw();
        as.Enum(enumExample) && as.enum(enumExample);
        expect(throwENum).to.throw();
    });
});
