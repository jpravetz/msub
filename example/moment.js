var moment = require('moment');

require('../dist').msub.init({
  format: function(value, format) {
    if (format && value instanceof Date) {
      return moment(value).format(format);
    }
    if (value === 'undefined' || value === 'null') {
      return "''";
    }
    return value;
  }
});

var newString = 'Today ${a:YYYYMMDD} and the year ${b:getFullYear} and ${c:} were the best ${d:toFixed:2}'.msub(
  { a: new Date(), b: new Date(1999, 12), c: undefined, d: 43.2345 }
);
console.log(newString);
