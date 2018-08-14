import * as fs from 'fs';
import { Settings } from './umtgTypes';

let settingsPath = process.env.HOME + '/.umtg';
let decksPath = settingsPath + '/decks';
let settingsFile = settingsPath + '/settings.json';

let data: Settings = {
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
    isGridActive: false
};

export { data };

let _writeSettingsFile = (settings: Settings) =>
    fs.writeFileSync(settingsFile, JSON.stringify(settings, null, 4));

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
    let settingsJson = JSON.parse(data.toString());
    exports.data = settingsJson;
}

export function setGridActive(status: boolean) {
    exports.data.isGridActive = status;
    _writeSettingsFile(exports.data);
}

export function setSetTypeVisible(set: string, status: boolean) {
    exports.data.setTypes[set] = status;
    _writeSettingsFile(exports.data);
}
