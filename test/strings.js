
require('../msub');
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

 });