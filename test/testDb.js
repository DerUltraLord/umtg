var assert = require('assert');
var db = require('../src/db.js');
var mydb = null;

describe('db.js', function() {

    beforeEach(function(done) {
        db.init(':memory:');
        done();
    });

    it('setAdd and getSets', function() {
        var myset = {
            code: "ultra",
            name: "ultra lord set",
            set_type: "ultratype",
        }
        var myset2 = {
            code: "foo",
            name: "bar",
            set_type: "othertype",
        }

        var finished = false;

        db.db.serialize(function() {

            db.setAdd(myset);
            db.setAdd(myset2);
            db.getSets(function(res) {
                assert.equal(res.length, 2);
                var set = JSON.parse(res[0].jsonString);
                assert.equal(set.code, "ultra");
                assert.equal(set.name, "ultra lord set");
                assert.equal(set.set_type, "ultratype");
                var set = JSON.parse(res[1].jsonString);
                assert.equal(set.code, "foo");
                assert.equal(set.name, "bar");
                assert.equal(set.set_type, "othertype");
            });

            db.getSets(function(res) {
                assert.equal(res.length, 1);

            }, ["ultratype"]);
        });




    });


});
