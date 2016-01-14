# msub
Adds simple, localization-friendly "msub" string replacement method to String class

## Usage

### Install via NPM

```bash
npm install msub
```

### Include in your project

Adds an ```msub``` method to the String class.
Only needs to be included once in your project.

```javascript
require('msub');
```

### Basic Usage

The method will replace all instances of a {PROP} in the string with a value.

```javascript
var newString = "This {1} {0} string".msub("my","is");
var newString = "This {1} {0} string".msub(["my","is"]);
var newString = "This {A} {B} string".msub({b:"my",a:"is"});
```

#### Arguments

Accepts three forms of arguments:

* Object: Key, value pair where all instances of {KEY} are replaced with value.
The keys are converted to uppercase and camelcase is separated with underscore, so
the key _isExtNow_ becomes _{IS_EXT_NOW}_. 
* A list of arguments: converted to array
* An array: replaces {0}, {1}, {2}, etc. with first, second, third, etc arguments.

The first variation of the method is useful for printing out properties of an object.

```javascript
var myObj = {
    id: "123",
    cn: "My common name",
    transId: "446"
};
console.log("Processing object {ID}, {CN} for {TRANS_ID}".msub(myObj));
```

If you need to use the actual string _{0}_ in your string, use the object variant
of the method, for example:

```javascript
var newString = "This {S} of {0} actually belongs in the string".msub({s:"instance"});
```

### Tests
To run the test suite, first install the dependencies, then run npm test:

```bash
$ npm install
$ npm test
```

Note that mocha needs to also be installed (it is assumed to be installed globally).

### License

[MIT](https://github.com/strongloop/express/blob/master/LICENSE)