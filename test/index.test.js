var msub = require('../dist').msub;
var moment = require('moment');

describe('msub v3', () => {
  beforeEach(done => {
    done();
  });

  describe('msub v3', () => {
    describe('object', () => {
      it('pass', done => {
        var s = 'Hello ${aB} to ${c} and ${c}'.msub({ aB: 'Bob', c: 'Harry' });
        expect(s).toBe('Hello Bob to Harry and Harry');
        expect(typeof s).toBe('string');
        done();
      });

      it('trailing chars', done => {
        var s = 'Hello ${aB} to ${c} and ${c}!'.msub({ aB: 'Bob', c: 'Harry' });
        expect(s).toBe('Hello Bob to Harry and Harry!');
        expect(typeof s).toBe('string');
        done();
      });
      it('missing', done => {
        var s = 'Hello ${aB} to ${c} only'.msub({ aB: 'Bob' });
        expect(s).toBe('Hello Bob to ${c} only');
        expect(typeof s).toBe('string');
        done();
      });
      it('misformed', done => {
        var s = 'Hello ${aB} to ${c and ${c}!'.msub({ aB: 'Bob', c: 'Harry' });
        expect(s).toBe('Hello Bob to ${c and ${c}!');
        expect(typeof s).toBe('string');
        done();
      });
    });
    describe('array', () => {
      it('pass', done => {
        var s = 'Hello ${0} to ${1} and ${1}'.msub(['Bob', 'Harry']);
        expect(s).toBe('Hello Bob to Harry and Harry');
        done();
      });
    });
    describe('args', () => {
      it('basic', done => {
        var s = 'Hello ${0} to ${1} and ${1}'.msub('Bob', 'Harry');
        expect(s).toBe('Hello Bob to Harry and Harry');
        done();
      });

      it('missing strings', done => {
        var s = 'Hello ${0} to ${2} and ${1}'.msub('Bob', 'Harry');
        expect(s).toBe('Hello Bob to ${2} and Harry');
        done();
      });

      it('true and false', done => {
        var s = 'Hello ${0} to ${2} and ${1}'.msub(true, false, true);
        expect(s).toBe('Hello true to true and false');
        done();
      });

      it('string numbers', done => {
        var s = 'Hello ${0} to ${2} and ${1}'.msub('0', '1');
        expect(s).toBe('Hello 0 to ${2} and 1');
        done();
      });

      it('number', done => {
        var s = 'Hello ${0} to ${2} and ${1}'.msub(0, 1);
        expect(s).toBe('Hello 0 to ${2} and 1');
        done();
      });

      it('undefined', done => {
        var s = 'Hello ${0} to ${2} and ${1}'.msub();
        expect(s).toBe('Hello ${0} to ${2} and ${1}');
        done();
      });
    });

    describe('number', () => {
      it('toFixed', done => {
        var n = 47.32455;
        var s = 'Hello ${n:toFixed:2} and Sam'.msub({ n: n });
        expect(s).toBe('Hello ' + n.toFixed(2) + ' and Sam');
        expect(typeof s).toBe('string');
        done();
      });
      it('string toFixed', done => {
        var n = 47.32455;
        var s = 'Hello ${n:toFixed:2} and Sam'.msub({ n: String(n) });
        expect(s).toBe('Hello ' + String(n) + ' and Sam');
        expect(typeof s).toBe('string');
        done();
      });
    });
    describe('date', () => {
      it('today', done => {
        var d = new Date();
        var s = 'Hello ${d:YYYYMMDD} and Sam'.msub({ d: d });
        expect(s).toBe('Hello ' + d.toString() + ' and Sam');
        expect(typeof s).toBe('string');
        done();
      });

      it('Date object', done => {
        var d = new Date(1988, 1);
        var d1 = new Date();
        var s = 'Hello ${d0:YYYYMMDD} and ${m3:YYYYMMDD} to ${d0:HHmmSS} and George'.msub(
          {
            d0: d,
            m3: d1
          }
        );
        expect(s).toBe(
          'Hello ' +
            d.toString() +
            ' and ' +
            d1.toString() +
            ' to ' +
            d.toString() +
            ' and George'
        );
        expect(typeof s).toBe('string');
        done();
      });

      it('Date array', done => {
        var d0 = new Date(1995, 1);
        var d1 = new Date();
        var s = 'Hello ${0:getFullYear} and ${1:toISOString} to ${0:toDateString} and George'.msub(
          d0,
          d1
        );
        expect(s).toBe(
          'Hello 1995 and ' +
            d1.toISOString() +
            ' to ' +
            d0.toDateString() +
            ' and George'
        );
        expect(typeof s).toBe('string');
        done();
      });
    });
    describe('moment', function() {
      beforeEach(done => {
        msub.init({
          format: (val, format) => {
            if (val instanceof Date) {
              return moment(val).format(format);
            }
            return val;
          }
        });
        done();
      });

      it('today', done => {
        var d = new Date();
        var s = 'Hello ${d:YYYYMMDD} and Sam'.msub({ d: d });
        expect(s).toBe('Hello ' + moment(d).format('YYYYMMDD') + ' and Sam');
        expect(typeof s).toBe('string');
        done();
      });

      it('Date object', done => {
        var d = new Date(1988, 3, 22);
        var d1 = new Date();
        var s = 'Hello ${d0:YYYYMMDD} and ${m3:YYYYMMDD} to ${d0:HHmmSS} and George'.msub(
          {
            d0: d,
            m3: d1
          }
        );
        expect(s).toBe(
          'Hello ' +
            moment(d).format('YYYYMMDD') +
            ' and ' +
            moment(d1).format('YYYYMMDD') +
            ' to ' +
            moment(d).format('HHmmSS') +
            ' and George'
        );
        expect(typeof s).toBe('string');
        done();
      });

      it('date array', done => {
        var d = new Date(1995, 1);
        var d1 = new Date();
        var s = 'Hello ${0:YYYYMMDD} and ${1:YYYYMMDD} to ${0:HHmmSS} and George'.msub(
          d,
          d1
        );
        expect(s).toBe(
          'Hello ' +
            moment(d).format('YYYYMMDD') +
            ' and ' +
            moment(d1).format('YYYYMMDD') +
            ' to ' +
            moment(d).format('HHmmSS') +
            ' and George'
        );
        expect(typeof s).toBe('string');
        done();
      });
    });
    describe('exec', () => {
      it('pass', done => {
        var s = msub.exec('Hello ${aB} to ${c} and ${c}', { aB: 'Bob', c: 'Harry' });
        expect(s).toBe('Hello Bob to Harry and Harry');
        expect(typeof s).toBe('string');
        done();
      });

      it('missing', done => {
        var s = msub.exec('Hello ${aB} to ${c} only', { aB: 'Bob' });
        expect(s).toBe('Hello Bob to ${c} only');
        expect(typeof s).toBe('string');
        done();
      });
    });
  });

  describe('msub version 0 behaviour', function() {
    beforeEach(done => {
      msub.init({
        open: '{',
        uppercase: true,
        format: (val, format) => {
          if (val instanceof Date) {
            return moment(val).format(format);
          }
          return val;
        }
      });
      done();
    });

    it('Object replacement', done => {
      var s = 'Hello {A_B} to {C} and {C}'.msub({ aB: 'Bob', c: 'Harry' });
      expect(s).toBe('Hello Bob to Harry and Harry');
      expect(typeof s).toBe('string');
      done();
    });

    it('Array replacement', done => {
      var s = 'Hello {0} to {1} and {1}'.msub(['Bob', 'Harry']);
      expect(s).toBe('Hello Bob to Harry and Harry');
      done();
    });

    it('Args replacement', done => {
      var s = 'Hello {0} to {1} and {1}'.msub('Bob', 'Harry');
      expect(s).toBe('Hello Bob to Harry and Harry');
      done();
    });

    it('Args replacement with missing strings', done => {
      var s = 'Hello {0} to {2} and {1}'.msub('Bob', 'Harry');
      expect(s).toBe('Hello Bob to {2} and Harry');
      done();
    });

    it('Args replacement with string numbers', done => {
      var s = 'Hello {0} to {2} and {1}'.msub('0', '1');
      expect(s).toBe('Hello 0 to {2} and 1');
      done();
    });

    it('Args number replacement', done => {
      var s = 'Hello {0} to {2} and {1}'.msub(0, 1);
      expect(s).toBe('Hello 0 to {2} and 1');
      done();
    });

    it('Args undefined replacement', done => {
      var s = 'Hello {0} to {2} and {1}'.msub();
      expect(s).toBe('Hello {0} to {2} and {1}');
      done();
    });

    it('Date replacement to today', done => {
      var d = new Date();
      var s = 'Hello {D:YYYYMMDD} and Sam'.msub({ d: d });
      expect(s).toBe('Hello ' + moment(d).format('YYYYMMDD') + ' and Sam');
      expect(typeof s).toBe('string');
      done();
    });

    it('Date replacement to object date', done => {
      var d = new Date(1988, 11, 22);
      var d1 = new Date();
      var s = 'Hello {D0:YYYYMMDD} and {M3:YYYYMMDD} to {D0:HHmmSS} and George'.msub({
        d0: d,
        m3: d1
      });
      expect(s).toBe(
        'Hello ' +
          moment(d).format('YYYYMMDD') +
          ' and ' +
          moment(d1).format('YYYYMMDD') +
          ' to ' +
          moment(d).format('HHmmSS') +
          ' and George'
      );
      expect(typeof s).toBe('string');
      done();
    });

    it('Date replacement to array date', done => {
      var d = new Date(1995, 1);
      var d1 = new Date();
      var s = 'Hello {0:YYYYMMDD} and {1:YYYYMMDD} to {0:HHmmSS} and George'.msub(d, d1);
      expect(s).toBe(
        'Hello ' +
          moment(d).format('YYYYMMDD') +
          ' and ' +
          moment(d1).format('YYYYMMDD') +
          ' to ' +
          moment(d).format('HHmmSS') +
          ' and George'
      );
      expect(typeof s).toBe('string');
      done();
    });
  });
});
