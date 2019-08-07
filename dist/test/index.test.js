"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const msub = __importStar(require("../src"));
const moment = __importStar(require("moment"));
describe('msub version 3 behaviour', function () {
    beforeEach(function (done) {
        done();
    });
    describe('msub v2', function () {
        it('Object replacement', function (done) {
            var s = 'Hello ${aB} to ${c} and ${c}'.msub({ aB: 'Bob', c: 'Harry' });
            expect(s).toBe('Hello Bob to Harry and Harry');
            expect(typeof s).toBe('string');
            done();
        });
        it('Array replacement', function (done) {
            var s = 'Hello ${0} to ${1} and ${1}'.msub(['Bob', 'Harry']);
            expect(s).toBe('Hello Bob to Harry and Harry');
            done();
        });
        it('Args replacement', function (done) {
            var s = 'Hello ${0} to ${1} and ${1}'.msub('Bob', 'Harry');
            expect(s).toBe('Hello Bob to Harry and Harry');
            done();
        });
        it('Args replacement with missing strings', function (done) {
            var s = 'Hello ${0} to ${2} and ${1}'.msub('Bob', 'Harry');
            expect(s).toBe('Hello Bob to ${2} and Harry');
            done();
        });
        it('Args replacement with true and false', function (done) {
            var s = 'Hello ${0} to ${2} and ${1}'.msub(true, false, true);
            expect(s).toBe('Hello true to true and false');
            done();
        });
        it('Args replacement with string numbers', function (done) {
            var s = 'Hello ${0} to ${2} and ${1}'.msub('0', '1');
            expect(s).toBe('Hello 0 to ${2} and 1');
            done();
        });
        it('Args number replacement', function (done) {
            var s = 'Hello ${0} to ${2} and ${1}'.msub(0, 1);
            expect(s).toBe('Hello 0 to ${2} and 1');
            done();
        });
        it('Args undefined replacement', function (done) {
            var s = 'Hello ${0} to ${2} and ${1}'.msub();
            expect(s).toBe('Hello ${0} to ${2} and ${1}');
            done();
        });
        it('Date replacement to today', function (done) {
            var d = new Date();
            var s = 'Hello ${d:YYYYMMDD} and Sam'.msub({ d: d });
            expect(s).toBe('Hello ' + d.toString() + ' and Sam');
            expect(typeof s).toBe('string');
            done();
        });
        it('Date replacement to object date', function (done) {
            var d = new Date(1988, 1);
            var d1 = new Date();
            var s = 'Hello ${d0:YYYYMMDD} and ${m3:YYYYMMDD} to ${d0:HHmmSS} and George'.msub({
                d0: d,
                m3: d1
            });
            expect(s).toBe('Hello ' +
                d.toString() +
                ' and ' +
                d1.toString() +
                ' to ' +
                d.toString() +
                ' and George');
            expect(typeof s).toBe('string');
            done();
        });
        it('Date replacement to array date', function (done) {
            var d0 = new Date(1995, 1);
            var d1 = new Date();
            var s = 'Hello ${0:getFullYear} and ${1:toISOString} to ${0:toDateString} and George'.msub(d0, d1);
            expect(s).toBe('Hello 1995 and ' + d1.toISOString() + ' to ' + d0.toDateString() + ' and George');
            expect(typeof s).toBe('string');
            done();
        });
    });
    describe('msub v2 with moment', function () {
        beforeEach(function (done) {
            msub({ moment: true });
            done();
        });
        it('Date replacement to today', function (done) {
            var d = new Date();
            var s = 'Hello ${d:YYYYMMDD} and Sam'.msub({ d: d });
            expect(s).toBe('Hello ' + moment(d).format('YYYYMMDD') + ' and Sam');
            expect(typeof s).toBe('string');
            done();
        });
        it('Date replacement to object date', function (done) {
            var d = new Date(1988, 3, 22);
            var d1 = new Date();
            var s = 'Hello ${d0:YYYYMMDD} and ${m3:YYYYMMDD} to ${d0:HHmmSS} and George'.msub({
                d0: d,
                m3: d1
            });
            expect(s).toBe('Hello ' +
                moment(d).format('YYYYMMDD') +
                ' and ' +
                moment(d1).format('YYYYMMDD') +
                ' to ' +
                moment(d).format('HHmmSS') +
                ' and George');
            expect(typeof s).toBe('string');
            done();
        });
        it('Date replacement to array date', function (done) {
            var d = new Date(1995, 1);
            var d1 = new Date();
            var s = 'Hello ${0:YYYYMMDD} and ${1:YYYYMMDD} to ${0:HHmmSS} and George'.msub(d, d1);
            expect(s).toBe('Hello ' +
                moment(d).format('YYYYMMDD') +
                ' and ' +
                moment(d1).format('YYYYMMDD') +
                ' to ' +
                moment(d).format('HHmmSS') +
                ' and George');
            expect(typeof s).toBe('string');
            done();
        });
    });
    describe('msub version 0 behaviour', function () {
        beforeEach(function (done) {
            msub({ open: '{', moment: true, uppercase: true });
            done();
        });
        it('Object replacement', function (done) {
            var s = 'Hello {A_B} to {C} and {C}'.msub({ aB: 'Bob', c: 'Harry' });
            expect(s).toBe('Hello Bob to Harry and Harry');
            expect(typeof s).toBe('string');
            done();
        });
        it('Array replacement', function (done) {
            var s = 'Hello {0} to {1} and {1}'.msub(['Bob', 'Harry']);
            expect(s).toBe('Hello Bob to Harry and Harry');
            done();
        });
        it('Args replacement', function (done) {
            var s = 'Hello {0} to {1} and {1}'.msub('Bob', 'Harry');
            expect(s).toBe('Hello Bob to Harry and Harry');
            done();
        });
        it('Args replacement with missing strings', function (done) {
            var s = 'Hello {0} to {2} and {1}'.msub('Bob', 'Harry');
            expect(s).toBe('Hello Bob to {2} and Harry');
            done();
        });
        it('Args replacement with string numbers', function (done) {
            var s = 'Hello {0} to {2} and {1}'.msub('0', '1');
            expect(s).toBe('Hello 0 to {2} and 1');
            done();
        });
        it('Args number replacement', function (done) {
            var s = 'Hello {0} to {2} and {1}'.msub(0, 1);
            expect(s).toBe('Hello 0 to {2} and 1');
            done();
        });
        it('Args undefined replacement', function (done) {
            var s = 'Hello {0} to {2} and {1}'.msub();
            expect(s).toBe('Hello {0} to {2} and {1}');
            done();
        });
        it('Date replacement to today', function (done) {
            var d = new Date();
            var s = 'Hello {D:YYYYMMDD} and Sam'.msub({ d: d });
            expect(s).toBe('Hello ' + moment(d).format('YYYYMMDD') + ' and Sam');
            expect(typeof s).toBe('string');
            done();
        });
        it('Date replacement to object date', function (done) {
            var d = new Date(1988, 11, 22);
            var d1 = new Date();
            var s = 'Hello {D0:YYYYMMDD} and {M3:YYYYMMDD} to {D0:HHmmSS} and George'.msub({
                d0: d,
                m3: d1
            });
            expect(s).toBe('Hello ' +
                moment(d).format('YYYYMMDD') +
                ' and ' +
                moment(d1).format('YYYYMMDD') +
                ' to ' +
                moment(d).format('HHmmSS') +
                ' and George');
            expect(typeof s).toBe('string');
            done();
        });
        it('Date replacement to array date', function (done) {
            var d = new Date(1995, 01);
            var d1 = new Date();
            var s = 'Hello {0:YYYYMMDD} and {1:YYYYMMDD} to {0:HHmmSS} and George'.msub(d, d1);
            expect(s).toBe('Hello ' +
                moment(d).format('YYYYMMDD') +
                ' and ' +
                moment(d1).format('YYYYMMDD') +
                ' to ' +
                moment(d).format('HHmmSS') +
                ' and George');
            expect(typeof s).toBe('string');
            done();
        });
    });
});
//# sourceMappingURL=index.test.js.map