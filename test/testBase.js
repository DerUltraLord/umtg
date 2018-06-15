const base = require('../src/base.js');
const should = require('chai').should()
const testUtils = require('./testUtils.js');

describe('Test base javascript lib', () => {

    before(() => {
        testUtils.mockFileRead("myTestContent")
        testUtils.mockReadDir(["test1.txt", "test2.txt"]);
        testUtils.mockGetJson({name: "dude"});
    });

    after(() => testUtils.shutdown());


    it('can match regular expressions', () => {
        let myregex = base.matchRegex(/\shey\s/);

        should.equal(myregex('hey '), null);
        myregex(' hey ').should.have.lengthOf(1);

        myregex = base.matchRegex(/\s(.*)\s(.*)\s/);
        let res = myregex(' hey dude ');
        res.should.have.lengthOf(3);
        res[0].should.be.equal(' hey dude ');
        res[1].should.be.equal('hey');
        res[2].should.be.equal('dude');
        
    })

    it('can match regex with named groups', () => {
        myregex = base.matchRegexGroup(/\s(?<first>.*)\s(?<second>.*)\s/);
        let res = myregex(' hey dude ');
        res.first.should.be.equal('hey');
        res.second.should.be.equal('dude');

        res = myregex(' alskjdlsajkd ');
        should.equal(res, null);

    });

    it('can read file contents', () => {
        base.readFile("somePath")
        .then((res) => {
            res.should.be.equal("myTestContent");
        });
    });

    it('can filelist from hard drive', (done) => {
        base.ls("somePath")
        .then((res) => {
            res[0].should.be.equal("test1.txt");
            res[1].should.be.equal("test2.txt");
            done();
        })
        .catch(console.log);
    });

    it('can make a json request', () => {
        return base.getJSON('some url');
    });

    it('can make a json request and transform result', (done) => {
        let p = base.getJSONTransformed('some url', res => res.name);
        testUtils.assertPromiseResult(p, done, (res) => {
            res.should.be.equal('dude');
        });
    });

});
