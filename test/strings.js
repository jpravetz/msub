
require('../msub');
var moment = require('moment');
var should = require('should');

 describe("msub test",function() {

     before(function(done) {
         done();
     });

     it("Object replacement",function(done) {
         var s = "Hello {A_B} to {C} and {C}".msub({aB:"Bob",c:"Harry"});
         s.should.equal("Hello Bob to Harry and Harry");
         (typeof s).should.equal('string');
         done();
     });

     it("Array replacement",function(done) {
         var s = "Hello {0} to {1} and {1}".msub(["Bob","Harry"]);
         s.should.equal("Hello Bob to Harry and Harry");
         done();
     });

     it("Args replacement",function(done) {
         var s = "Hello {0} to {1} and {1}".msub("Bob","Harry");
         s.should.equal("Hello Bob to Harry and Harry");
         done();
     });

     it("Args replacement with missing strings",function(done) {
         var s = "Hello {0} to {2} and {1}".msub("Bob","Harry");
         s.should.equal("Hello Bob to {2} and Harry");
         done();
     });

     it("Args replacement with string numbers",function(done) {
         var s = "Hello {0} to {2} and {1}".msub("0","1");
         s.should.equal("Hello 0 to {2} and 1");
         done();
     });

     it("Args number replacement",function(done) {
         var s = "Hello {0} to {2} and {1}".msub(0,1);
         s.should.equal("Hello 0 to {2} and 1");
         done();
     });

     it("Args undefined replacement",function(done) {
         var s = "Hello {0} to {2} and {1}".msub();
         s.should.equal("Hello {0} to {2} and {1}");
         done();
     });

     it("Date replacement to today",function(done) {
         var d = new Date();
         var s = "Hello {D:YYYYMMDD} and Sam".msub({d:d});
         s.should.equal("Hello " + moment(d).format('YYYYMMDD') + " and Sam");
         (typeof s).should.equal('string');
         done();
     });

     it("Date replacement to object date",function(done) {
         var d = new Date(1988);
         var d1 = new Date();
         var s = "Hello {D0:YYYYMMDD} and {M3:YYYYMMDD} to {D0:HHmmSS} and George".msub({d0:d,m3:d1});
         s.should.equal("Hello " + moment(d).format('YYYYMMDD') + " and " + moment(d1).format('YYYYMMDD') + " to " + moment(d).format('HHmmSS') + " and George");
         (typeof s).should.equal('string');
         done();
     });

     it("Date replacement to array date",function(done) {
         var d = new Date(1995);
         var d1 = new Date();
         var s = "Hello {0:YYYYMMDD} and {1:YYYYMMDD} to {0:HHmmSS} and George".msub(d,d1);
         s.should.equal("Hello " + moment(d).format('YYYYMMDD') + " and " + moment(d1).format('YYYYMMDD') + " to " + moment(d).format('HHmmSS') + " and George");
         (typeof s).should.equal('string');
         done();
     });

 });
