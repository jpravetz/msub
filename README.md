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

This package also creates an `msub` singleton. When needing to access this
singleton (_e.g._ to call `init` method):

```javascript
// Access msub singleton
var msub = require('msub').msub;
```

With typescript, retrieves msub singleton with it's `init` method.

```ts
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
  - `${a:YYYYMMDD}` will use the `format` callback if specified
  - `${a:getFullYear}` will use Date's `getFullYear` method (tests if a Date and method exists on Date).
  - `${a:toFixed:2}` will use Number's `toFixed(2)` method (tests if a number and method exists on number).
- A list of argument values (treated as an array)
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

If you need to use the actual string `${0}` in your string, use the object variant
of the method, for example:

```javascript
var obj = { s: 'instance' };
console.log('This ${s} of ${0} actually belongs in the string'.msub(obj));
```

```bash
This instance of ${0} actually belongs in the string
```

### Values

Values can be strings, numbers, booleans or, dates.

If the corresponding key in the string does not contain a colon, the values are
directly converted to Strings.

If the key contains a colon then formatting may occur. msub first looks at the
value type (must be date or number) and to see if the format string is a
compatible name of a method on a Date or Number. If it is then that method will
be called. Otherwise, if a `format` callback is provided, that callback will be
called with the value and format string. See _Formatting_ below for more information.

## Initialization Options

- `open` (_string_) - Specify an open string delimiter, for example use `{` to
  use `{myString}` rather than `${myString}`. Defaults to `${`.
- `close` (_string_) - Specify a close string delimiter. Usually the closing
  brace will be automatically selected to match the opening brace (see supported
  matching braces below). Defaults to `}`.
- `uppercase` (_boolean_) - If true, uppercase property names within the
  string are converted to camelcase before referencing values in the msub
  parameter dictionary (_e.g._ `MY_STRING` becomes `myString`).
- `format` (_function_) - Callback, if specified, to use to format values that
  contain a colon. Called with the value and the optional portion of the
  substitution that is after the colon (see _Formatting_ below).

Supported matching braces:

```ts
'${': '}',
'#{': '}',
'{{': '}}',
'{': '}',
'(': ')',
'[': ']',
'<': '>',
'<<': '>>'
```

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

`msub` supports custom formatting of numbers and Date objects via

- the `format` callback option, set using the `init` method.
- method names and parameters specified as part of the substitution key (_e.g._ `${n:toFixed:2}`).
  - the method name must exist on the value, otherwise the `format` callback will be used if it exists.

Example using the [moment](https://momentjs.com/) package.

```javascript
var moment = require('moment');

require('../dist').msub.init({
  format: function(value, format) {
    if (format && value instanceof Date) {
      return moment(value).format(format);
    }
    return value;
  }
});

var newString = 'Today ${a:YYYYMMDD} and the year ${b:getFullYear} and ${c:} were the best ${d:toFixed:2}'.msub(
  { a: new Date(), b: new Date(1999, 12), c: undefined, d: 43.2345 }
);
console.log(newString);
```

outputs:

```bash
Today 20190808 and the year 2000 and ${c:} were the best 43.23
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
