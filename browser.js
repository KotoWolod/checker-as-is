import Checker from './dist/as-is.browser.min.js';
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
    regExp_, promise_, json_, json5_, error_, rangeError_, referenceError_, syntaxError_, typeError_,
    checker_];
const numerous_ = typeof_.concat(special_.slice(-1));

is.string(string_) && as.string(string_);
is.String(string_) && as.String(string_);
is.number(number_) && as.number(number_);
is.Number(number_) && as.Number(number_);
is.boolean(boolean_) && as.boolean(boolean_);
is.Boolean(boolean_) && as.Boolean(boolean_);
is.bigInt(bigInt_) && as.bigInt(bigInt_);
is.BigInt(boolean_) && as.BigInt(boolean_);
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
is.EegExp(regExp_) && as.regExp(regExp_);
is.error(error_) && as.error(error_);
is.RangeError(rangeError_) && as.RangeError(rangeError_);
is.ReferenceError(referenceError_) && as.ReferenceError(referenceError_);
is.SyntaxError(syntaxError_) && as.SyntaxError(syntaxError_);
is.TypeError(typeError_) && as.TypeError(typeError_);
is.promise(promise_) && as.promise(promise_);
is.json(json_) && as.json(json_);
is.json5(json5_) && as.json5(json5_);
is.checker(checker_) && as.checker(checker_);
is.Checker(Checker) && as.Checker(Checker);
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
is.strings(exampleObject) && as.strings(exampleObject);
is.strings(exampleArray) && as.strings(exampleArray);
is.strings(exampleSet) && as.strings(exampleSet);
is.strings(exampleMap) && as.strings(exampleMap);
const strict = new Strict(
    type.string`name`,
    type.number`age`,
    type.strings`pages`
);
strict.name = 'Mike';
strict.age = 12;
strict.pages = [''];
strict.bla = 1;
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
window.document.body.innerHTML=`
<div style="text-align: left; padding-left: 20%"> <h2>Syntax</h2>
is.string(string_) && as.string(string_);<br>
is.String(string_) && as.String(string_);<br>
is.number(number_) && as.number(number_);<br>
is.Number(number_) && as.Number(number_);<br>
is.boolean(boolean_) && as.boolean(boolean_);<br>
is.Boolean(boolean_) && as.Boolean(boolean_);<br>
is.bigInt(bigInt_) && as.bigInt(bigInt_);<br>
is.BigInt(boolean_) && as.BigInt(boolean_);<br>
is.undefined(undefined_) && as.undefined(undefined_);<br>
is.null(null_) && as.null(null_);<br>
is.array(undefined_) && as.array(undefined_);<br>
is.array(array_) && as.array(array_);<br>
is.date(date_) && as.date(date_);<br>
is.object(object_) && as.object(object_);<br>
is.set(set_) && as.set(set_);<br>
is.map(map_) && as.map(map_);<br>
is.WeakSet(weakSet_) && as.WeakSet(weakSet_);<br>
is.WeakMap(weakMap_) && as.WeakMap(weakMap_);<br>
is.WeakRef(weakRef_) && as.WeakRef(weakRef_);<br>
is.EegExp(regExp_) && as.regExp(regExp_);<br>
is.error(error_) && as.error(error_);<br>
is.RangeError(rangeError_) && as.RangeError(rangeError_);<br>
is.ReferenceError(referenceError_) && as.ReferenceError(referenceError_);<br>
is.SyntaxError(syntaxError_) && as.SyntaxError(syntaxError_);<br>
is.TypeError(typeError_) && as.TypeError(typeError_);<br>
is.promise(promise_) && as.promise(promise_);<br>
is.json(json_) && as.json(json_);<br>
is.json5(json5_) && as.json5(json5_);<br>
is.checker(checker_) && as.checker(checker_);<br>
is.Checker(Checker) && as.Checker(Checker);<br>
is.empty(string_) && as.empty(string_);<br>
is.empty(array_) && as.empty(array_);<br>
is.empty(object_) && as.empty(object_);<br>
is.empty(set_) && as.empty(set_);<br>
is.empty(map_) && as.empty(map_);<br>
is.empty(weakSet_) && as.empty(weakSet_);<br>
is.empty(weakMap_) && as.empty(weakMap_);<br>
is.empty(weakRef_) && as.empty(weakRef_);<br>
is.empty(weakRef_) && as.empty(weakRef_);<br>
is.notEmpty(string_) && as.notEmpty('string_');<br>
is.notEmpty(exampleArray) && as.notEmpty(exampleArray);<br>
is.notEmpty(exampleObject) && as.notEmpty(exampleObject);<br>
is.notEmpty(exampleSet) && as.notEmpty(exampleSet);<br>
is.notEmpty(exampleMap) && as.notEmpty(exampleMap);<br>
is.notEmpty(weakSet_.add(object_)) && as.notEmpty(weakSet_.add(object_));<br>
is.notEmpty(weakMap_.set(object_, 1)) && as.notEmpty(weakMap_.set(object_, 1));<br>
is.notEmpty(new WeakRef({t:1})) && as.notEmpty(new WeakRef({t:1}));<br>
is.strings(exampleObject) && as.strings(exampleObject);<br>
is.strings(exampleArray) && as.strings(exampleArray);<br>
is.strings(exampleSet) && as.strings(exampleSet);<br>
is.strings(exampleMap) && as.strings(exampleMap);<br> 
<br>
const strict = new Strict(
<p style="padding-left: 2%"> 
    type.string\`name\`,<br>
    type.number\`age\`,<br>
    type.strings\`pages\`<br>
</p>    
);<br>
<br>
strict.name = 'Mike';<br>
strict.age = 12;<br>
strict.pages = [''];<br>
strict.bla = 1;<br>
as.NumberStringBooleanSymbolFunctionBigIntArrayDateObjectSetMapWeakSetWeakMapWeakRefRegExpPromiseErrorRangeErrorReferenceErrorSyntaxErrorTypeErrorArrayDateNotEmptyEmptyJsonJson5Checker(2);<br>
as.Number_String_Boolean_Symbol_Function_BigInt_Array([]);<br>
as['Number|String|Boolean']('text');<br>
is['Number-String-Boolean'](true);<br>
as['Number or String or Boolean'](777);<br>
as['it can be any text with type definition like String or Number'](111);<br>
<br>
multi\`Number|String|Boolean\`(2022);<br>
multi(['Number|String|Boolean'])(true);<br>
<br>
const multiType = 'Number|String|Boolean';<br>
as[multiType](1);<br>
<h3>works!</h3> </div>
<h2 style="text-align: center"> All tests completed</h2>
`;