const should = require('chai').should();
const settings = require('../src/settings.js');
const testUtils = require('./testUtils.js');
const base = require('../src/base.js');


describe('Test Settings of umtg app', () => {

    before(() => {
        testUtils.mockFileRead('{"setTypes": {"ultra": false}, "grid": false}')
        testUtils.mockBasicReturn(base, 'isdir', true);
        testUtils.mockBasicReturn(base, 'isfile', true);
        testUtils.mockToDoNothing(base, 'writeFile');
    });

    after(() => testUtils.shutdown());


    it('should read settings from a file', () => {
        settings.init();
    });

    it('should manage show grid settings', () => {
        settings.init();
        settings.isGridActive().should.be.false;
        settings.setGridActive(true);
        settings.isGridActive().should.be.true;
    });

    it('check if specific set type should be displayed', () => {
        settings.init();
        settings.isSetTypeVisible('ultra').should.be.false;
    });

    it('change display status of specific set type', () => {
        settings.init();
        settings.isSetTypeVisible('ultra').should.be.false;
        settings.setSetTypeVisible('ultra', true);
        settings.isSetTypeVisible('ultra').should.be.true;
    });

    it('get a object with all set types', () => {
        settings.init();
        res = settings.getSetTypes();
        res["ultra"].should.be.false;
    });


});
