import * as base from './base';
import * as fs from 'fs';

let settingsPath = process.env.HOME + '/.umtg';
let decksPath = settingsPath + '/decks';
let settingsFile = settingsPath + '/settings.json';

var data = {
    'setTypes': {
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
    'isGridActive': false,
};

export { data };


export function init() {

    if (!fs.existsSync(settingsPath)) {
        fs.mkdirSync(settingsPath);
    }

    if (!fs.existsSync(decksPath)) {
        fs.mkdirSync(decksPath);
    }

    if (!fs.existsSync(settingsFile)) {
        _writeSettingsFile(exports.data);
    }

    let data = fs.readFileSync(settingsFile);
    let settingsJson = JSON.parse(JSON.stringify(data));
    exports.data = settingsJson;
};

export function setGridActive(status) {
    exports.data.isGridActive = status;
    _writeSettingsFile(exports.data);
};


export function setSetTypeVisible(set, status) {
    exports.data.setTypes[set] = status;
    _writeSettingsFile(exports.data);
};


let _writeSettingsFile = (settings) => 
    base.writeFileSync(settingsFile, JSON.stringify(settings, null, 4));

