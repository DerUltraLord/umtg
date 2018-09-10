import fs from 'fs';
import { join } from 'path';

import { Settings } from '../umtgTypes';
let HOME = process.env.HOME;
if (HOME === undefined) {
    HOME = process.env.USERPROFILE;
}

export const state: Settings = {
    setTypes: {
        available: [
            'core', 
            'expansion',
            'master',
            'masterpiece',
            'from_the_vault',
            'spellbook',
            'premium_deck',
            'draft_innovation',
            'commander',
            'planechase',
            'archenemy',
            'vanguard',
            'funny',
            'starter',
            'box',
            'promo',
            'token',
            'memorabila',
        ],
        selected: new Set(['core', 'expansion', 'master'])
    },
    isGridActive: false,
    settingsPath: HOME + '/.umtg',
    decksFolder: 'decks',
    settingsFile: 'settings.json',
    infoPopupContent: [
        {name: 'Set', attrib: 'set'},
        {name: 'Mana Cost', attrib: 'cmc'},
        {name: 'Power', attrib: 'power'},
        {name: 'Toughness', attrib: 'toughness'},
    ]
};

export function initSettings(store: any): void {
    const state: Settings = store.state.settings;
    console.log("initSettings");

    if (!fs.existsSync(store.state.settings.settingsPath)) {
        fs.mkdirSync(store.state.settings.settingsPath);
    }

    let decksFolder = join(store.state.settings.settingsPath, store.state.settings.decksFolder);
    if (!fs.existsSync(decksFolder)) {
        fs.mkdirSync(decksFolder);
    }

    let settingsFile = join(store.state.settings.settingsPath, store.state.settings.settingsFile);
    if (!fs.existsSync(settingsFile)) {
        actions.writeSettingsToFile({state: store.state.settings});
    }

    let data = fs.readFileSync(settingsFile);
    // TODO: check version of settings file
    let settingsJson = JSON.parse(data.toString());
    store.state.settings = settingsJson;
}

export const mutations = {
    setGridActive(state: Settings, value: boolean): void {
        state.isGridActive = value;        
    },

    addInfoPopupContent(state: Settings, { displayName, property }: { displayName: string, property: string }): void {
        if (state.infoPopupContent.map((item) => item.displayName).indexOf(displayName) >= 0) {
            throw Error("Display name already in Info Popup")
        }
        state.infoPopupContent.push({displayName: displayName, property: property});
    },
    removeInfoPopupContent(state: Settings, displayName: string): void {
        let index = state.infoPopupContent.map((item) => item.displayName).indexOf(displayName);
        if (index >= 0) {
            state.infoPopupContent.splice(index, 1);
        }
       
    },
    changeInfoPopupContentByIndex(state: Settings, {index, newValue}: {index: number, newValue: any}): void {
        state.infoPopupContent[index] = newValue;
    }
};

export const actions = {

    writeSettingsToFile({state}: {state: Settings}): void {
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
