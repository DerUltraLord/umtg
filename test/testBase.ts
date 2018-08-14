import { expect } from 'chai';

import * as base from '../src/main/base';
import * as testUtils from './testUtils';

describe('Test base javascript lib', () => {

    before(() => {
        testUtils.initSandbox();
        testUtils.mockFileRead('myTestContent');
        testUtils.mockReadDir(['test1.txt', 'test2.txt']);
        testUtils.mockGetJson({ name: 'dude' });
    });

    after(() => testUtils.shutdown());

    it('can match regular expressions', () => {
        expect(base.matchRegex(/\shey\s/, ' hey')).to.be.null;
        expect(base.matchRegex(/\shey\s/, ' hey ')).to.be.lengthOf(1);

        let res = base.matchRegex(/\s(.*)\s(.*)\s/, ' hey dude ');
        expect(res).to.not.equal(null);
        if (res !== null) {
            expect(res).to.be.lengthOf(3);
            expect(res[0]).to.be.equal(' hey dude ');
            expect(res[1]).to.be.equal('hey');
            expect(res[2]).to.be.equal('dude');
        }
    });

    it('can match regex with named groups', () => {
        let res = base.matchRegexGroup(/\s(?<first>.*)\s(?<second>.*)\s/, ' hey dude ');
        expect(res.first).to.be.equal('hey');
        expect(res.second).to.be.equal('dude');

    });


    it('can make a json request', () => {
        return base.getJSON('some url');
    });

    it('can make a json request and transform result', (done) => {
        let p = base.getJSONTransformed('some url', (res: any) => res.name);
        testUtils.assertPromiseResult(p, done, (res: any) => {
            expect(res).to.be.equal('dude');
        });
    });

});
