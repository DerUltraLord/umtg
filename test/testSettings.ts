import { expect } from 'chai';
import fs from 'fs';
import * as sinon from 'sinon';
import _, { initSettings, mutations, actions, getters } from '../src/renderer/store/modules/settings';
import { Settings } from '../src/renderer/store/umtgTypes';


let sandbox: sinon.SinonSandbox;
let state : Settings;

describe('store/modules/settings.ts for Settings Management', () => {

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        state = {
            setTypes: {
                available: ['ultra'],
                selected: new Set(['ultra']),
            },
            isGridActive: false,
            settingsPath: 'foo',
            decksFolder: 'foo',
            settingsFile: 'foo',
            infoPopupContent: [],
        };
        sandbox.stub(fs, 'existsSync').callsFake(() => true);
        sandbox.stub(fs, 'readFileSync').callsFake(() => JSON.stringify(state));
    });

    afterEach(() => sandbox.restore());

    it('helpers: initSettings', () => {

        const dispatch = sinon.spy();
        let store = {
            'state': {
                'settings': state
            },
            'dispatch': dispatch,

        };
        initSettings(store);
    });

    it('mutations: setGridActive', () => {
        expect(getters.isGridActive(state)).to.be.false;
        mutations.setGridActive(state, true);
        expect(getters.isGridActive(state)).to.be.true;
    });

    it('mutations: add-/removeInfoPopupContent', () => {
        mutations.addInfoPopupContent(state, {displayName: "myDisplayName", property: "property"});
        expect(state.infoPopupContent[0].displayName).to.be.equal('myDisplayName');
        expect(state.infoPopupContent[0].property).to.be.equal('property');

        expect(() => 
            mutations.addInfoPopupContent(state, {displayName: "myDisplayName", property: "property"})
        ).to.throw();

        mutations.removeInfoPopupContent(state, "myDisplayName");
        expect(state.infoPopupContent.length).to.be.equal(0);
    });

});
