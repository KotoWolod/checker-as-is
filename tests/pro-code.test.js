try {
    var { Checker, BaseInterface, Enum, MicroTest, primitiveTypes, structuralTypes, otherTypes, aliasTypes } = window;
} catch (e) {
    var { Checker, BaseInterface, Enum, MicroTest, primitiveTypes,
        structuralTypes, otherTypes, aliasTypes } =  await import('../index.js');
}

const checker = new Checker();
const { multi, Interface, strict, as, is, IF, ELSE, END, optional, get }  = checker;
const { START, STOP, FINISH, METHOD, PROPERTY, IS, passed, failed } = new MicroTest({ is, as });
const string_ = '';
const number_ = 2;
const boolean_ = true;
const symbol_ = Symbol('test');
const function_ = function(){};
const bigInt_ = BigInt('1234567890123456789012345678901234567890');
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
const json5_ = '{property: "value"}';
const error_ = new Error('this is error');
const rangeError_ = new RangeError('this is RangeError');
const referenceError_ = new ReferenceError('this is ReferenceError');
const syntaxError_ = new SyntaxError('this is SyntaxError');
const typeError_ = new TypeError('this is TypeError');
const checker_ = new Checker();

const exampleObject = {};
const generator_ = function*() { yield 0; yield 1; };
const exampleString = 'example string';
const segment_ = (new Intl.Segmenter('en', { granularity: 'word' })).segment(exampleString);
new Array(10).fill(0).forEach((_, idx)=> Object.assign(exampleObject, {[`prop${idx}`]:string_}));
const exampleArray = [...Array(10).keys(10)]
const exampleSet = new Set(exampleArray);
const exampleMap = new Map();
Object.keys(exampleObject).forEach((item)=> exampleMap.set(item, exampleObject[item]));

const primitive_ = [string_, number_, boolean_, symbol_, function_, bigInt_];
const structural_ = [ array_, date_, object_, set_, map_, weakSet_, weakMap_, weakRef_,
    regExp_, promise_, json_, json5_, error_, rangeError_, referenceError_, syntaxError_, typeError_,
    checker_];
const numerousValues_ = primitive_.concat(structural_.slice(-1));
const numerousTypes_ = primitiveTypes.concat(structuralTypes);
const withLengthEmpty = [string_, array_, object_, set_, map_];
const iterable = [string_, array_, set_, map_, segment_, object_, symbol_];
const withLengthNotEmpty = ['string_', exampleArray, exampleObject, exampleSet, exampleMap];
let buffer_;

is.node() && (
    buffer_ = new Buffer.alloc(5),
    structural_.push(buffer_)
);

START.all;
    START.Instance;
        IS.class(Checker);
        IS.Checker(Checker);
        const instance = new Checker();
        ['is', 'as', 'IF', 'ELSE', 'optional'].forEach((methodName)=> IS.Checker(instance[methodName]));
        IS.null(instance.END);
        IS.Checker(instance);
        METHOD.multi(instance);
        METHOD.Interface(instance);
        PROPERTY.strict(instance);
        PROPERTY.get(instance);
    STOP.Instance;
    START.CheckMethods;
        ['alias', 'CheckPlatform', 'iterator', 'nullish', 'bun', 'browser', 'browserFromList', 'node', 'any',
            'multiCheck', 'multiType', 'defineMethod', 'duplicateError', 'numerous', 'primitive', 'array', 'json',
            'json5', 'empty', 'notEmpty', 'date', 'null', 'structural', 'class']
            .forEach((methodName)=> METHOD[methodName](Checker));
    as.class(BaseInterface);
    STOP.CheckMethods;
    START.CheckValues
        IS.ok(true);
        IS.true(true);
        IS.notOk(false);
        IS.false(false);
        IS.null(null);
        IS.undefined();
        IS.empty([]);
        IS.argument([]);
        IS.true(5 === 5);
        IS.true(5 > 4);
        IS.false(5 >= 5);
        IS.true([2].includes(2));
    STOP.CheckValues;
    START.optional;
        IS.undefined(optional.string())
    STOP.optional;
    START.newValidators;
        if(is.node() || is.bun()){
            IS.undefined(iterable.forEach((item)=> as.iterable(item)))
            IS.object(is.argument(object_) && as.argument(object_))
            IS.array(is.argument(array_) && as.argument(array_))
            IS.undefined(is.nullish() && as.nullish())
            IS.process(is.node() && as.node())
        } else if(is.browser()) {
            IS.undefined(iterable.forEach((item)=> as.iterable(item)))
            IS.object(is.argument(object_) && as.argument(object_))
            IS.array(is.argument(array_) && as.argument(array_))
            IS.undefined(is.nullish() && as.nullish())
            IS.Navigator(is.browser() && as.browser())
        }
    STOP.newValidators;
    START.if_else
        function someFunction(name, age, friends,
                              _= [as.stringNumberArray(name),
                                  as.undefinedNumberArray(age),
                                  as.undefinedArray(friends)
                              ]) {
            IF.string(name) && is.number(age) && is.array(friends)? (
                as.array(_) && as.notEmpty(_)
            ):ELSE.string(name) && is.array(age)? (
                friends = age,
                    age = undefined
            ):ELSE.number(name) && is.array(age)? (
                friends = age,
                    age = name,
                    name = undefined
            ):ELSE.array(name)? (
                friends = name,
                    name = undefined
            ):END;
            return {name, age, friends};
        };
        let { name, age, friends } = someFunction('Rick', 25, ['Mike', 'Liza']);
        IS.false(name === 'Rick');
        IS.false(age === 25);
        IS.true(friends.includes('Mike'));
        IS.true(friends.includes('Liza'));
        ({ name, age, friends } = someFunction('Rick',['Mike', 'Liza']))
        IS.true(name === 'Rick');
        IS.undefined(age);
        IS.true(friends.includes('Mike'));
        IS.false(friends.includes('Liza'));
        ({ name, age, friends } = someFunction(25, ['Mike', 'Liza']))
        IS.undefined(name);
        IS.true(age === 25);
        IS.true(friends.includes('Mike'));
        IS.true(friends.includes('Liza'));
        ({ name, age, friends } = someFunction(['Mike', 'Liza']))
        IS.undefined(name);
        IS.undefined(age);
        IS.false(friends.includes('Mike'));
        IS.true(friends.includes('Liza'));
    STOP.if_else
FINISH.all;
