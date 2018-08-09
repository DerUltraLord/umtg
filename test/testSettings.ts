import { expect } from 'chai';
import * as settings from '../src/main/settings';
import * as testUtils from './testUtils';
import * as base from '../src/main/base';

describe('Test Settings of umtg app', () => {

    beforeEach(() => {
        testUtils.mockFileRead('{"setTypes": {"ultra": false}, "isGridActive": false}');
        testUtils.mockBasicReturn(base, 'isdir', true);
        testUtils.mockBasicReturn(base, 'isfile', true);
        testUtils.mockToDoNothing(settings, 'init');
        testUtils.mockToDoNothing(base, 'writeFileSync');
    });

    afterEach(() => testUtils.shutdown());

    it('should read settings from a file', () => {
        settings.init();
    });

    it('should manage show grid settings', () => {
        settings.init();
        expect(settings.data.isGridActive).to.be.false;
        settings.setGridActive(true);
        expect(settings.data.isGridActive).to.be.true;
    });

    it('check if specific set type should be displayed', () => {
        settings.init();
        expect(settings.data.setTypes['core']).to.be.true;
    });

    it('change display status of specific set type', () => {
        settings.init();
        expect(settings.data.setTypes['core']).to.be.true;
        settings.setSetTypeVisible('core', false);
        expect(settings.data.setTypes['core']).to.be.false;
    });

});
