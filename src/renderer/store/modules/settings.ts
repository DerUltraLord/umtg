import * as fs from 'fs';
import { join } from 'path';

import { Settings } from '../umtgTypes';

export const state: Settings = {
    setTypes: {
        core: true,
        expansion: true,
        masters: true,
        masterpiece: false,
        from_the_vault: false,
        spellbook: false,
        premium_deck: false,
        duel_deck: false,
        commander: false,
        planechase: false,
        conspiracy: false,
        archenemy: false,
        vanguard: false,
        funny: false,
        starter: false,
        box: false,
        promo: false,
        token: false,
        memorabilia: false
    },
    isGridActive: false,
    settingsPath: process.env.HOME + '/.umtg',
    decksFolder: 'decks',
    settingsFile: 'settings.json'
};

export function initSettings(store: any): void {
    const state: Settings = store.state.settings;

    if (!fs.existsSync(store.state.settings.settingsPath)) {
        fs.mkdirSync(store.state.settings.settingsPath);
    }

    let decksFolder = join(store.state.settings.settingsPath, store.state.settings.decksFolder);
    if (!fs.existsSync(decksFolder)) {
        fs.mkdirSync(decksFolder);
    }

    let settingsFile = join(store.state.settings.settingsPath, store.state.settings.settingsFile);
    if (!fs.existsSync(settingsFile)) {
        store.dispatch('writeSettingsToFile');
    }

    let data = fs.readFileSync(settingsFile);
    let settingsJson = JSON.parse(data.toString());
    store.state.settings = settingsJson;
}

export const mutations = {

    setGridActive(state: Settings, value: boolean): void {
        state.isGridActive = value;        
    },

    setSetVisibleStatus(state: Settings, {setKey, value}: {setKey: string, value: boolean}): void {
        state.setTypes[setKey] = value;
    }
};

export const actions = {

    writeSettingsToFile({state: any}: {state:any}): void {
        fs.writeFileSync(join(state.settingsPath, state.settingsFile), JSON.stringify(state, null, 4));
    }
};

export const getters = {
    isGridActive(state: Settings): boolean {
        return state.isGridActive;
    },
    
    getSetTypes(state: Settings): any {
        return state.setTypes;
    }
};

export default {
    namespaced: true,
    state: state,
    mutations: mutations,
    actions: actions,
    getters: getters
};
