const Settings = require('./settings.js')
const Scryfall = require('./scryfall.js')

exports.init = () => {
    Settings.init();
    exports.state.settings = Settings.data;
}

// Settings
exports.setGridActive = Settings.setGridActive;
exports.setSetTypeVisible = Settings.setSetTypeVisible;

// Scryfall
exports.searchScryfallByFilter = Scryfall.searchByFilter;
exports.getScryfallSearchFilter = Scryfall.getSearchFilter;


exports.state = {
    settings: null,
}
