const base = require('./base.js');
const fs = require('fs')


let settingsPath = process.env.HOME + "/.umtg";
let settingsFile = settingsPath + "/settings.json";

let settingsJson = null

defaultSettings = {
    "setTypes": {
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
    "grid": false
};

exports.init = () => {

    if (!fs.lstatSync(settingsPath).isDirectory()) {
        base.mkdir(settingsPath);
    }

    if (!fs.lstatSync(settingsFile).isFile()) {
        _writeSettingsFile(defaultSettings);
    }

    data = fs.readFileSync(settingsFile)
    settingsJson = JSON.parse(data);

}

exports.isGridActive = () => settingsJson['grid'];
exports.setGridActive = (status) => {
    settingsJson['grid'] = status;
    _writeSettingsFile(settingsJson);
}
exports.isSetTypeVisible = set => settingsJson['setTypes'][set];
exports.setSetTypeVisible = (set, status) => {
    settingsJson['setTypes'][set] = status;
    _writeSettingsFile(settingsJson);
}
exports.getSetTypes = () => settingsJson['setTypes'];

let _writeSettingsFile = (settings) => 
    base.writeFile(settingsFile, JSON.stringify(settings, null, 4))
