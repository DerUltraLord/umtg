import { expect } from 'chai';
import { SinonSandbox, createSandbox } from 'sinon';

import * as Base from '../src/renderer/store/base';
import { scryfallReqest, getCardByName, getSearchFilter, buildSearchString } from '../src/renderer/store/scryfall';
import { Card } from '../src/renderer/store/umtgTypes';

let sandbox: SinonSandbox;

describe('scryfall.js', () => {

    beforeEach(() => {
        sandbox = createSandbox();
    });

    afterEach(() => sandbox.restore());

    it('can do a scryfall request', (done) => {
        const getJSON = sandbox.stub(Base, 'getJSON');
        getJSON.onCall(0).resolves({'data': [{'name': 'Ichor Wellspring'}], 'has_more': true, 'next_page': 'foo'});
        getJSON.onCall(1).resolves({'data': [{'name': 'Ultra Lord'}]});
        
        scryfallReqest<Card>('some cards')
            .then((cards) => {
                expect(cards[0].name).to.be.equal('Ichor Wellspring');
                expect(cards[1].name).to.be.equal('Ultra Lord');
                done();
            });

    });

    it('can search for card by name', (done) => {
        sandbox.stub(Base, 'getJSON').resolves({'data': [{'name': 'Ichor Wellspring'}]});
        getCardByName('Ichor Wellspring')
        .then((res) => {
            expect(res.name).to.be.equal('Ichor Wellspring');
            done();
        });
    });


    it('transform search fields to scryfall search', () => {
        let res = getSearchFilter('Ichor');
        expect(res['name']).to.be.equal('Ichor');

        res = getSearchFilter('Ichor', 'enchantment');
        expect(res['name']).to.be.equal('Ichor');
        expect(res['t:']).to.be.equal('enchantment');

        res = getSearchFilter('Ichor', 'enchantment', 'this is a text');
        expect(res['name']).to.be.equal('Ichor');
        expect(res['t:']).to.be.equal('enchantment');
        expect(res['o:']).to.be.equal('this is a text');

        res = getSearchFilter('Ichor', 'enchantment', 'this is a text', 'xln');
        expect(res['name']).to.be.equal('Ichor');
        expect(res['t:']).to.be.equal('enchantment');
        expect(res['o:']).to.be.equal('this is a text');
        expect(res['e:']).to.be.equal('xln');

        res = getSearchFilter('Ichor t:creature', 'enchantment', 'this is a text', 'xln');
        expect(res['name']).to.be.equal('Ichor');
        expect(res['t:']).to.be.equal('enchantment creature');

        res = getSearchFilter('Ichor t:creature o:some', 'enchantment', 'some', 'xln');
        expect(res['name']).to.be.equal('Ichor');
        expect(res['t:']).to.be.equal('enchantment creature');
        expect(res['o:']).to.be.equal('some some');

        res = getSearchFilter('Ichor e:riv', 'enchantment', 'some', 'xln');
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
        let res = buildSearchString(filter);
        expect(res).to.be.equal('foo t:enchantment t:creature o:some o:text e:xln e:rix');
    });
});
