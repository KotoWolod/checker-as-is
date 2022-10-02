const modules = await import('../index.js')

const { Checker, BaseInterface, Enum, MicroTest } =  modules;
const checker = new Checker();
const { multi, Interface, strict, as, is, IF, ELSE, END, optional, get }  = checker;
const { START, STOP, FINISH, METHOD, PROPERTY, IS, passed, failed } = new MicroTest({ is, as });
import * as values_ from './values.js';
const values = Object.assign({}, values_);

is.node() && (
    values.buffer_ = new Buffer.alloc(5),
    values.structural_.push(values.buffer_)
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
        IS.true(5 >= 5);
        IS.true([2].includes(2));
    STOP.CheckValues;
    START.optional;
        IS.undefined(optional.string())
    STOP.optional;
    START.newValidators;
        if(is.node() || is.bun()){
            IS.undefined(values.iterable.forEach((item)=> as.iterable(item)))
            IS.object(is.argument(values.object_) && as.argument(values.object_))
            IS.array(is.argument(values.array_) && as.argument(values.array_))
            IS.undefined(is.nullish() && as.nullish())
            IS.process(is.node() && as.node())
        } else if(is.browser()) {
            IS.undefined(values.iterable.forEach((item)=> as.iterable(item)))
            IS.object(is.argument(values.object_) && as.argument(values.object_))
            IS.array(is.argument(values.array_) && as.argument(values.array_))
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
        IS.true(name === 'Rick');
        IS.true(age === 25);
        IS.true(friends.includes('Mike'));
        IS.true(friends.includes('Liza'));
        ({ name, age, friends } = someFunction('Rick',['Mike', 'Liza']))
        IS.true(name === 'Rick');
        IS.undefined(age);
        IS.true(friends.includes('Mike'));
        IS.true(friends.includes('Liza'));
        ({ name, age, friends } = someFunction(25, ['Mike', 'Liza']))
        IS.undefined(name);
        IS.true(age === 25);
        IS.true(friends.includes('Mike'));
        IS.true(friends.includes('Liza'));
        ({ name, age, friends } = someFunction(['Mike', 'Liza']))
        IS.undefined(name);
        IS.undefined(age);
        IS.true(friends.includes('Mike'));
        IS.true(friends.includes('Liza'));
    STOP.if_else
FINISH.all;
