# msub

Adds a simple, localization-friendly "msub" string replacement method to String class, including support for date values.

Declares typescript types.

## Install via NPM

```bash
npm install msub
```

## Include in your project

Adds an `msub` method to the String class. This only needs to be included in your project once.

```javascript
require('msub');
```

If you need access to the `msub` singleton (_e.g._ to call init method):

```javascript
// Access msub singleton
var msub = require('msub').msub;
```

With typescript

```ts
import {} from 'msub';
```

```ts
// Access msub singleton
import { msub } from 'msub';
```

## Default Use

The `msub` method replaces all instances of a `${prop}` in a string with a value.
Substitutions may be specified as property key/value pairs in an object, or as array entries.

```javascript
var newString = 'This ${a} ${bC} string'.msub({ bC: 'my', a: 'is' });
var newString = 'This ${1} {$0} string'.msub('my', 'is');
var newString = 'This ${1} ${0} string'.msub(['my', 'is']);
```

### Arguments

Accepts three forms of arguments:

- Object: Key, value pair where all instances of `${key}` are replaced with
  value (see Values section below). In the special case where the key contains a
  colon, a formatter will be called. For example
  - `${a:YYYYMMDD}` will use the format callback if specified
  - `${a:getFullYear}` will use Date's `getFullYear` method (tests if method exists on Date or number).
  - `${a:toFixed:2}` will use Number's `toFixed(2)` method.
- A list of argument values: converted to array
- An array: replaces ${0}, ${1}, \${2}, etc. with first, second, third, etc argument value.

The first variation of the method is useful for printing out properties of an object.

```javascript
var myObj = {
  id: 123,
  cn: 'My common name',
  transId: '446'
};
console.log('Processing object ${id}, ${cn} for ${transId}'.msub(myObj));
```

If you need to use the actual string _\${0}_ in your string, use the object variant
of the method, for example:

```javascript
var newString = "This ${S} of ${0} actually belongs in the string".msub({s:"instance"});

// Output
This instance of ${0} actually belongs in the string
```

### Values

Values can be strings, numbers, booleans or, dates.

If the corresponding key in the string does not contain a colon, the values are
directly converted to Strings.

If the key contains a colon then formatting may occur. msub first looks at the
value type and to see if the format string is a compatible name of a method on a
Date or Number. If it is then that method will be called. Otherwise, if a format
callback is provided, that callback will be called.

Examples date formatting:

```javascript
var myObj = {
  d0: new Date(),
  d1: new Date(1999, 11),
  transId: '446'
};
console.log(
  'The dates ${d0:YYYYMMDD} and ${d1:YYYYMMDD} belong to ${transId}'.msub(myObj)
);
console.log(
  'The dates ${d0:toISOString} and ${d1:getFullYear} belong to ${transId}'.msub(myObj)
);
```

You must initialize msub with a `format` callback to support custom date formatting.

```js
let opts = {};
```

## Initialization Options

- `open` (_string_) - Specify an open string delimiter, for example use `{` to
  use `{myString}` rather than `${myString}`. Defaults to `${`.
- `close` (_string_) - Specify a close string delimiter. If `open` is
  specified and open is one of `{`, `[`, `<` or `(` then close will by default
  use the matching ending brace. Otherwise defaults to `}`.
- `uppercase` (_boolean_) - If true, uppercase property names within the
  string are converted to camelcase before referencing values in the msub
  parameter dictionary (_e.g._ `MY_STRING` becomes `myString`).
- `format` (_function_) - Callback, if specified, to use to format values that
  contain a colon. Called with the value and the optional portion of the
  substitution that is after the colon.

To use string delimiter

```javascript
require('msub')({ open: '{' });
var newString = 'This {a} {bC} string'.msub({ bC: 'my', a: 'is' });
```

To support uppercase property names of form `{MY_STRING}` that are converted to camelcase (_MY_STRING_ becomes _myString_).

```javascript
require('msub')({ uppercase: true });
var newString = 'This ${A} ${B_C} string'.msub({ bC: 'my', a: 'is' });
```

## Formatting

`msub` supports custom formatting for numbers and Date objects via

- the `format` callback option
- method names and parameters specified as part of the substitution key
  - the method name must exist on the value

Example using the [moment](https://momentjs.com/) package.

```javascript
var moment = require('moment');

require('msub').msub.init({
  format: function(value:any,format:string) {
    if( format && value instanceof Date ) {
      return moment(value).format(format);
    }
    if( value === 'undefined' || value === 'null' ) {
      return "''";
    }
    return value;
  };
});

var newString = 'Today ${a:YYYYMMDD} and the year ${b:getFullYear} and ${c:} were the best ${d:toFixed:2}'
  .msub({ a: new Date(), b: new Date(1999,12), c: undefined, d: 43.2345 });
// output: "Today 20190807 and the year 1999 and '' were the best 43.23"
```

## Versions

### Version 3

- Zero external dependencies (previously might have imported `moment` library)
- Specifies types for typescript
- Changes to `init` method options:
  - Removes `moment` and the optional import of
    [moment.js](http://momentjs.com/) library and passes responsibility for date
    formatting to the caller.
  - Adds `format` callback option that can be used for any value, just add a
    colon and optional format string.
  - Adds `close` option
  - Closing brace defaults to mirror of `open` option if `open` is one of `{`,
    `[`, `<` or `(`.

If you are not using `moment` then you should be safe to upgrade. If you are using
`moment`, you will need to add a `format` callback option.

### Version 2

Version 2 default string replacement specifiers are similar to ES6 string literals, using
the syntax `${myVariableName}`.
Version 2 default behaviour breaks the default version 0.x behaviour.

Initialize msub to use v0.x.x default behaviour as following:

```javascript
require('msub')({ open: '{', moment: true, uppercase: true });

var newString = 'This {A} {B_C} string'.msub({ bC: 'my', a: 'is' });
```

## Tests

To run the test suite, first install the dependencies, then run npm test:

```bash
$ npm install
$ npm test
```

## License

[MIT](https://github.com/strongloop/express/blob/master/LICENSE)
