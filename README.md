# msub
Adds a simple, localization-friendly "msub" string replacement method to String class, including support for date values.

## Install via NPM

```bash
npm install msub
```

## Include in your project

Adds an ```msub``` method to the String class. This only needs to be included in your project once.

```javascript
require('msub');
```
## Default Use

The msub method replaces all instances of a ````${prop}``` in a string with a value.
Substitutions may be specified as property key/value pairs in an object, or as array entries.

```javascript
var newString = "This ${a} ${bC} string".msub({bC:"my",a:"is"});
var newString = "This ${1} {$0} string".msub("my","is");
var newString = "This ${1} ${0} string".msub(["my","is"]);
```

### Arguments

Accepts three forms of arguments:

* Object: Key, value pair where all instances of ````${key}``` are replaced with value (see Values section below).
In the special case where the value is a Date object, and msub is initalized with ```{moment: true}```, the key matches strings in the form _${expiresOn:format}_.
* A list of argument values: converted to array
* An array: replaces ${0}, ${1}, ${2}, etc. with first, second, third, etc argument value.

The first variation of the method is useful for printing out properties of an object.

```javascript
var myObj = {
    id: 123,
    cn: "My common name",
    transId: "446"
};
console.log("Processing object ${id}, ${cn} for ${transId}".msub(myObj));
```

If you need to use the actual string _${0}_ in your string, use the object variant
of the method, for example:

```javascript
var newString = "This ${S} of ${0} actually belongs in the string".msub({s:"instance"});

// Output
This instance of ${0} actually belongs in the string
```

### Values

Values can be strings, numbers, booleans or, dates. Strings, numbers and booleans are directly converted to Strings.
Dates are converted using a Date method or the [moment.js](http://momentjs.com/) format method, 
with formatting specified in the string as shown in this example:

```javascript
var myObj = {
    d0: new Date(),
    d1: new Date(1999),
    transId: "446"
};
console.log("The dates ${d0:YYYYMMDD} and ${d1:YYYYMMDD} belong to ${transId}".msub(myObj));
console.log("The dates ${d0:toISOString} and ${d1:getFullYear} belong to ${transId}".msub(myObj));
```

You must initialize msub with ```{moment: true}``` to support moment date formatting.

## Initialization Options

To use string delimiter syntax of ```{myString}``` rather than ```${myString}```

```javascript
require('msub')({open:'{'});
var newString = "This {a} {bC} string".msub({bC:"my",a:"is"});
```

To support uppercase property names of form ```{MY_STRING}``` that are converted to camelcase (_MY_STRING_ becomes _myString_).

```javascript
require('msub')({uppercase:true});
var newString = "This ${A} ${B_C} string".msub({bC:"my",a:"is"});
```
To support date formatting using the [moment](https://momentjs.com/) package.

```javascript
require('msub')({moment:true});
```

## Versions

Version 2 default string replacement specifiers are similar to ES6 string literals, using
the syntax ````${myVariableName}````.
Version 2 default behaviour breaks the default version 0.x behaviour.

Initialize msub to use v0.x.x default behaviour as following:

```javascript
require('msub')({open:'{',moment:true,uppercase:true});

var newString = "This {A} {B_C} string".msub({bC:"my",a:"is"});
```

## Tests

To run the test suite, first install the dependencies, then run npm test:

```bash
$ npm install
$ npm test
```

## License

[MIT](https://github.com/strongloop/express/blob/master/LICENSE)
