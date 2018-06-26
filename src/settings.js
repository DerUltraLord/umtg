const base = require('./base.js');


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

    return new Promise((success, failure) => {

        if (!base.isdir(settingsPath)) {
            base.mkdir(settingsPath)
            .then()
            .catch(failure);
        }

        if (!base.isfile(settingsFile)) {
            _writeSettingsFile(defaultSettings)
            .then()
            .catch(failure);
        }

        base.readFile(settingsFile)
        .then((data) => {
            settingsJson = JSON.parse(data);
            success();
        })
        .catch(failure);
    })

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
