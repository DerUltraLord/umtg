var assert = require('assert');
var scry = require('../src/scryfall.js');

describe('scryfall.js', function() {

    it('getSearchFilter()', function() {
        res = scry.getSearchFilter('Ichor');
        assert.equal(res['name'], 'Ichor');

        res = scry.getSearchFilter('Ichor', 'enchantment');
        assert.equal(res['name'], 'Ichor');
        assert.equal(res['t:'], 'enchantment');

        res = scry.getSearchFilter('Ichor', 'enchantment', 'this is a text');
        assert.equal(res['name'], 'Ichor');
        assert.equal(res['t:'], 'enchantment');
        assert.equal(res['o:'], 'this is a text');

        res = scry.getSearchFilter('Ichor', 'enchantment', 'this is a text', 'xln');
        assert.equal(res['name'], 'Ichor');
        assert.equal(res['t:'], 'enchantment');
        assert.equal(res['o:'], 'this is a text');
        assert.equal(res['e:'], 'xln');

        res = scry.getSearchFilter('Ichor t:creature', 'enchantment', 'this is a text', 'xln');
        assert.equal(res['name'], 'Ichor');
        assert.equal(res['t:'], 'enchantment creature');

        res = scry.getSearchFilter('Ichor t:creature o:some', 'enchantment', 'some', 'xln');
        assert.equal(res['name'], 'Ichor');
        assert.equal(res['t:'], 'enchantment creature');
        assert.equal(res['o:'], 'some some');

        res = scry.getSearchFilter('Ichor e:riv', 'enchantment', 'some', 'xln');
        assert.equal(res['name'], 'Ichor');
        assert.equal(res['t:'], 'enchantment');
        assert.equal(res['o:'], 'some');
        assert.equal(res['e:'], 'xln riv');


    });

    it('buildSearchString()', function() {
        filter = {
            'name': 'foo',
            't:': 'enchantment creature',
            'o:': 'some text',
            'e:': 'xln rix',
        };
        res = scry.buildSearchString(filter);
        assert.equal(res, 'foo t:enchantment t:creature o:some o:text e:xln e:rix');
    });
});
