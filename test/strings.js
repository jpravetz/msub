
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

     it("Args escaped replacement",function(done) {
         var s = "Hello {0} to {2} and {1}".msub("Bob","Harry");
         s.should.equal("Hello Bob to {2} and Harry");
         done();
     });

 });