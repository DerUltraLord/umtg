import { expect } from 'chai';

import * as scry from '../src/main/scryfall';
import * as testUtils from './testUtils';

describe('scryfall.js', () => {

    before(() => {
        testUtils.mockGetJson({ data: [{ name: 'Ichor Wellspring' }] });
    });

    after(() => testUtils.shutdown);

    it('can search for card by name', (done) => {
        let p = scry.getCardByName('Ichor Wellspring');
        testUtils.assertPromiseResult(p, done, (res: any) => {
            expect(res.name).to.be.equal('Ichor Wellspring');
        });
    });

    it('can do a generic scyfall search', () => {
        return scry.search('e:xln');
    });

    it('transform search fields to scryfall search', () => {
        let res = scry.getSearchFilter('Ichor');
        expect(res['name']).to.be.equal('Ichor');

        res = scry.getSearchFilter('Ichor', 'enchantment');
        expect(res['name']).to.be.equal('Ichor');
        expect(res['t:']).to.be.equal('enchantment');

        res = scry.getSearchFilter('Ichor', 'enchantment', 'this is a text');
        expect(res['name']).to.be.equal('Ichor');
        expect(res['t:']).to.be.equal('enchantment');
        expect(res['o:']).to.be.equal('this is a text');

        res = scry.getSearchFilter('Ichor', 'enchantment', 'this is a text', 'xln');
        expect(res['name']).to.be.equal('Ichor');
        expect(res['t:']).to.be.equal('enchantment');
        expect(res['o:']).to.be.equal('this is a text');
        expect(res['e:']).to.be.equal('xln');

        res = scry.getSearchFilter('Ichor t:creature', 'enchantment', 'this is a text', 'xln');
        expect(res['name']).to.be.equal('Ichor');
        expect(res['t:']).to.be.equal('enchantment creature');

        res = scry.getSearchFilter('Ichor t:creature o:some', 'enchantment', 'some', 'xln');
        expect(res['name']).to.be.equal('Ichor');
        expect(res['t:']).to.be.equal('enchantment creature');
        expect(res['o:']).to.be.equal('some some');

        res = scry.getSearchFilter('Ichor e:riv', 'enchantment', 'some', 'xln');
        expect(res['name']).to.be.equal('Ichor');
        expect(res['t:']).to.be.equal('enchantment');
        expect(res['o:']).to.be.equal('some');
        expect(res['e:']).to.be.equal('xln riv');

    });

    it('build a search string for from object', () => {
        let filter = {
            'name': 'foo',
            't:': 'enchantment creature',
            'o:': 'some text',
            'e:': 'xln rix'
        };
        let res = scry.buildSearchString(filter);
        expect(res).to.be.equal('foo t:enchantment t:creature o:some o:text e:xln e:rix');
    });
});
