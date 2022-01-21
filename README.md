# checker-as-is v0.6.1

Check your types at runtime with ESNext syntax by meta programing in node.js and browser and even more.
follow me on twitter for further updates [twitter](https://twitter.com/VolodymyrKotov)
 
### Summary of Features 
**Types list with alias name:** 
- Number | number 
- String | string
- Boolean | boolean
- Symbol  | symbol
- Function | function
- BigInt | bigInt | bigint
- Array | array
- Date | date
- Object | date
- Set | set
- Map | map
- WeakSet | weakSet | weeakset
- WeakMap | wearMap | weakmap 
- WeakRef | weakRef | weakref
- RegExp | regExp | regexp
- Promise | promise
- Error | error
- RangeError | rangeError
- ReferenceError | referenceError
- SyntaxError |syntaxError
- TypeError | typeError


**Multi type checking:**
- String | Number | Boolean | etc ... 

**Strict type object:**
    
     type.string`name`
     strict.name = 'string'

**Validators list:** 
- NotEmpty | notEmpty
- Empty | empty
- JSON | Json | json
- JSON5 | Json5 | json

**Class checking:** 
- [className]

**Integrations:**

    import {default as email} from 'validator/lib/isEmail';
    
    is.email('foo@bar.com'); // true | false
    as.email('foo@bar.com'); // true | TypeError

## Install
**Node.js**
```sh
npm i checker-as-is -S
```
**Browsers**
```html
<script src="https://unpkg.com/checker-as-is@^0.6.1/dist/as-is.browser.min.min.js"></script>
```
# API
## Basics
```js
is['js type here']('argument here') // argument | false
as['js type here']('argument here') // argument | TypeError
```
An example
```js
import Checker from 'checker-as-is';
const { multi, Strict, type, as, is } = new Checker();


//positive
is.string('example string'); // 'example string'
as.string('example string'); // 'example string'

//negative
is.number('example string'); // false
as.string('example string'); // TypeError: String is not a(an) number
```
## Basic Usage
```js
import Checker from 'checker-as-is';
const { multi, Strict, type, as, is } = new Checker();

function example(arg, arg2, arg3) {
    as.string(arg);
    as.number(arg2);
    as.boolean(arg3);

    console.log(arg, arg2, arg3);
};
example(text, 2, true)
// text, 2, true 
```
or next syntax
```js 
import Checker from 'checker-as-is';
const { multi, Strict, type, as, is } = new Checker();

function example(arg, arg2, arg3) {
    as.string(arg), as.number(arg2), as.boolean(arg3);

    console.log(arg, arg2, arg3);
};
example(text, 2, true)
//[ text, 2, true ]
```
or more extraordinary syntax
```js
import Checker from 'checker-as-is';
const { multi, Strict, type, as, is } = new Checker();

function example(arg, arg2, arg3,
                       type = [as.string(arg), as.number(arg2), as.boolean(arg3)]) {
    console.log(type);
};
example(text, 2, true)
//[ text, 2, true ]

```
For more code readability:
```js
import Checker from 'checker-as-is';
const { multi, Strict, type, as, is } = new Checker();

is?.string('example string');
as?.string('example string');
```
### You can even check the class type
```js
import Checker from 'checker-as-is';
const instance = new Checker();

is.Checker(Checker); // class Checker
as.Checker(Checker);// class Checker

is.Checker(instance); // class instance
as.Checker(instance);// class instance


```

## Checking one repeated type
In object, array, set and map. All types ending in 's' will be checked.
```js
        is.strings(exampleObject) && as.strings(exampleObject);
        is.Numbers(exampleArray) && as.Numbers(exampleArray);
        is.Errors(exampleSet) && as.Errors(exampleSet);
        is.BigInts(exampleMap) && as.BigInts(exampleMap); 
```
## Strict typing
### Basics
```js

new Strict(type['js type here']`variable name`);// <-- meta programing magic
// after that
type['js type here']`variable name`;
```
```js
const strict = new Strict(type.string`name`);
strict.name = 'Stephen Hawking';
```
### Basic usage
```js
import Checker from 'checker-as-is';
const { multi, Strict, type, as, is } = new Checker();
//-- Do it once!
const strict = new Strict(
    type.string`name`,
    type.number`age`,
    type.strings`pages`
);
//--
strict.name = 'Mike';
strict.age = 12;
strict.pages = ['pageOne', 'pageTwo'];
strict.bla = 1; // will not be assigned
console.log(strict.name, strict.age, strict.pages);

// Mike 12 [ 'pageOne', 'pageTwo' ]

strict.name = 2022;
// TypeError: Number is not a(an) string
```
Use strictObject.values() to get all values.
```js
const values = strict.values();
console.log(values);
// { name: 'Mike', age: 12, pages: [ 'pageOne', 'pageTwo' ] }
```
Once the strict instance has been created, you can do the following:
```js
type.string`example`;
strict.example = '2';
```
**Strict has reserved variable names:** get, set, values, types, variable, lastType. This means that you can do the following;
```js
const strict = new Strict(type.null`get`);
//or
const strict = new Strict(type.undefined`set`);
//or
const strict = new Strict(type.array`values`);
//or
const strict = new Strict(type.object`variables`);

type.string`example`;
strict.example = '2';

// when you call strict.values()
// you only get { example: '2' }. Any of the reserved variable names will be hidden.
```
Only one strict object in one file is possible, if you want to instantiate any other object, you will get a reference to the first one.
This is because **Strict** must have access to the checker engine.
```js
const strict = new Strict(type.null`set`);
type.string`example`;

const secondStrict = new Strict(type.null`get`);
secondStrict.example = '2';

console.log(strict.values());
// { example: '2' }
```
Any tricks will not help you get the second strict object. Maybe I'll find a solution for this because I think it's a bug, not a feature :)
```js
import Checker from 'checker-as-is';
const { multi, Strict, type, as, is } = new Checker();

type.string`example`;
strict.example = 'first';

// even second import
import { default as CEngine }   from 'checker-as-is';
const { Strict: secondStrict } = new CEngine();

const secondStrict = new SecondStrict(type.null`get`);
secondStrict.string`example2`;
secondStrict.example2 = 'second';

secondStrict.values();
//{ example: 'first', example2: 'second' }
```
## Checking multiple types
When a variable is part of more than one type, you can also check for that. 
### Basic
```js
is['couple js type here']('argument here'); // argument | false
as['couple js type here']('argument here'); // argument | TypeError

// as alias syntax
multi`couple js type here`('argument here'); // argument | TypeError
multi(['couple js type here'])('argument here'); // argument | TypeError

```
### Basic usage
```js
as.NumberStringBoolean(2022);
as.Number_String_Boolean_Symbol_Function_BigInt_Array([]);
as['Number|String|Boolean']('text');
as['Number-String-Boolean'](true);
as['Number or String or Boolean'](777);
as['it can be any text with type definition like String or Number'](111);

multi`Number|String|Boolean`(2022);
multi(['Number|String|Boolean'])(true);

const multiType = 'Number|String|Boolean';
as[multiType]({});
// TypeError: Object is not a(an) Number|String|Boolean
```

## Integration
You can integrate any feature you want.
```js
import Checker from 'checker-as-is';
import axios from "axios";

const integrate = {
    up: async function (url) {
        const result = await axios.get(url);
        if(result.status === 200) return 'Ok';
        else throw new TypeError('url is down');
    }
};

const { multi, Strict, type, as, is } = new Checker(integrate);
const isUrl = as;

async function example(arg, arg2, arg3,
                       type = [as.string(arg), as.number(arg2), as.boolean(arg3)]) {
    await isUrl.up('https://google.com');
    console.log(type);
};

await example('text', 2, true)
// [ 'text', 2, true ]

await isUrl?.up('https://not-google.com');
// TypeError: url is down
```
## Settings
To change error message you can reload Checker.errorMsg.
If you want to swap "is" on "as". In standard behaviour 'is' returns boolean and "as" throws TypeErrors. If you set Checker.swap to true, now 'as' will returns boolean and 'is' will throws TypeErrors.
```js
const checker = new Checker(integrate);
checker.errorMsg = (params)=> `${params[2] || (params[0]?.constructor 
                                   ? params[0].constructor.name
                                   :params[0])
                           } , really? I'm not sure that is a(an) ${params[1]}`;

const { multi, Strict, type, as, is } = checker;
checker.swap = true;
// TypeError: Number, really? I'm not sure that is a(an) string
```
#
**No dependencies except of json5 in vendor folder, pure javascript code. No selfish syntax, if you know javascript you can write code without any challenges.**
