const should = require('chai').should();
const settings = require('../src/main/settings.js');
const testUtils = require('./testUtils.js');
const base = require('../src/main/base.js');


describe('Test Settings of umtg app', () => {

    beforeEach(() => {
        testUtils.mockFileRead('{"setTypes": {"ultra": false}, "isGridActive": false}')
        testUtils.mockBasicReturn(base, 'isdir', true);
        testUtils.mockBasicReturn(base, 'isfile', true);
        testUtils.mockToDoNothing(settings, 'init');
        testUtils.mockToDoNothing(base, 'writeFileSync');
        settings.data = {
            "setTypes": {"ultra": false},
            "isGridActive": false
        }
    });

    afterEach(() => testUtils.shutdown());


    it('should read settings from a file', () => {
        settings.init();
    });

    it('should manage show grid settings', () => {
        settings.init();
        settings.data.isGridActive.should.be.false;
        settings.setGridActive(true);
        settings.data.isGridActive.should.be.true;
    });

    it('check if specific set type should be displayed', () => {
        settings.init();
        settings.data.setTypes['ultra'].should.be.false;
    });

    it('change display status of specific set type', () => {
        settings.init();
        settings.data.setTypes['ultra'].should.be.false;
        settings.setSetTypeVisible('ultra', true);
        settings.data.setTypes['ultra'].should.be.true;
    });

    it('get a object with all set types', () => {
        settings.init();
        res = settings.data.setTypes;
        res["ultra"].should.be.false;
    });

});
