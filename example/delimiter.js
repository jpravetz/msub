require('../dist');

var obj = { s: 'instance' };
console.log('This ${s} of ${0} actually belongs in the string'.msub(obj));
