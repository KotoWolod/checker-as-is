import {Checker} from '../lib/as-is.class.js';
import primitiveTypes from '../lib/types/primitiveTypes.js';
import structuralTypes from '../lib/types/structuralTypes.js';

export const string_ = '';
export const number_ = 2;
export const boolean_ = true;
export const symbol_ = Symbol('test');
export const function_ = function(){};
export const bigInt_ = BigInt('1234567890123456789012345678901234567890');
export const undefined_ = undefined;
export const null_ = null;
export const array_ = [];
export const date_ = new Date();
export const object_ = {};
export const set_ = new Set();
export const map_ = new Map();
export const weakSet_ = new WeakSet();
export const weakMap_ = new WeakMap();
export const weakRef_ = new WeakRef(object_);
export const regExp_ = new RegExp(/./g);
export const promise_ = new Promise((_)=> _);
export const json_ = JSON.stringify({test: 'test'});
export const json5_ = '{property: "value"}';
export const error_ = new Error('this is error');
export const rangeError_ = new RangeError('this is RangeError');
export const referenceError_ = new ReferenceError('this is ReferenceError');
export const syntaxError_ = new SyntaxError('this is SyntaxError');
export const typeError_ = new TypeError('this is TypeError');
export const checker_ = new Checker();

export const exampleObject = {};
export const generator_ = function*() { yield 0; yield 1; };
export const exampleString = 'example string';
export const segment_ = (new Intl.Segmenter('en', { granularity: 'word' })).segment(exampleString);
new Array(10).fill(0).forEach((_, idx)=> Object.assign(exampleObject, {[`prop${idx}`]:string_}));
export const exampleArray = [...Array(10).keys(10)]
export const exampleSet = new Set(exampleArray);
export const exampleMap = new Map();
Object.keys(exampleObject).forEach((item)=> exampleMap.set(item, exampleObject[item]));

export const primitive_ = [string_, number_, boolean_, symbol_, function_, bigInt_];
export const structural_ = [ array_, date_, object_, set_, map_, weakSet_, weakMap_, weakRef_,
    regExp_, promise_, json_, json5_, error_, rangeError_, referenceError_, syntaxError_, typeError_,
    checker_];
export const numerousValues_ = primitive_.concat(structural_.slice(-1));
export const numerousTypes_ = primitiveTypes.concat(structuralTypes);
export const withLengthEmpty = [string_, array_, object_, set_, map_];
export const iterable = [string_, array_, set_, map_, segment_, object_, symbol_];
export const withLengthNotEmpty = ['string_', exampleArray, exampleObject, exampleSet, exampleMap];
