// compile using 'tsc --lib ES2015 moment2.ts'

import * as moment from 'moment';
import { msub } from '../dist';

msub.init({
  format: function(value, format) {
    if (format && value instanceof Date) {
      return moment(value).format(format);
    }
    return value;
  }
});

let newString = 'Today ${a:YYYYMMDD} and the year ${b:getFullYear} and ${c:} were the best ${d:toFixed:2}'.msub(
  { a: new Date(), b: new Date(1999, 12), c: undefined, d: 43.2345 }
);
console.log(newString);
