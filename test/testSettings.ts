import { expect } from 'chai';
import * as fs from 'fs';
import * as sinon from 'sinon';
import _, { mutations, actions, getters } from '../src/renderer/store/modules/settings';
import { Settings } from '../src/renderer/store/umtgTypes';


let sandbox: sinon.SinonSandbox;
let state : Settings;

describe('store/modules/settings.ts for Settings Management', () => {

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        state = {
            setTypes: {
                ultra: true,
            },
            isGridActive: false,
            settingsPath: 'foo',
            decksFolder: 'foo',
            settingsFile: 'foo',
        }
        sandbox.stub(fs, 'existsSync').callsFake(() => true);
        sandbox.stub(fs, 'readFileSync').callsFake(() => JSON.stringify(state));
    });

    afterEach(() => sandbox.restore());

    it('mutations: setGridActive', () => {
        expect(getters.isGridActive(state)).to.be.false;
        mutations.setGridActive(state, true);
        expect(getters.isGridActive(state)).to.be.true;
    });

    it('mutations: setSetVisibleStatus', () => {
        expect(getters.getSetTypes(state)['ultra']).to.be.true;
        mutations.setSetVisibleStatus(state, {setKey: 'ultra', value: false});
        expect(getters.getSetTypes(state)['ultra']).to.be.false;
    });

    it('action: initSettings', () => {
        const dispatch = sinon.spy();
        actions.initSettings({state, dispatch});
    });

    it('getter: getSetTypes', () => {
        expect(getters.getSetTypes(state)['ultra']).to.be.true;
    });

});
