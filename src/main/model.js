const Settings = require('./settings.js')

exports.init = () => {
    Settings.init();
    exports.settings = Settings.data;
}

exports.setGridActive = Settings.setGridActive
exports.setSetTypeVisible = Settings.setSetTypeVisible


exports.settings = null;
