<settings-page>
    <p>Settings Page</p>
    <ul>
        <li each="{ value, name in settings.setTypes }">
            <input onClick={ onSetTypeClicked() } type="checkbox" value={ name } checked={ value }>{ name }</input>
        </li>
    <ul>
    <script type="es6">
        let fs = require("fs");
        var settingsPath = "/home/maximilian/.umtg";
        var settingsFile = settingsPath + "/settings.json";


        this.settings = {
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
            }
        };


        this.on("mount", function() {
            this.loadSettingsFromFile();
            this.update();
        });

        this.onSetTypeClicked = () => {
            return (e) => {
                this.settings.setTypes[e.srcElement.value] = e.srcElement.checked;
                this.settingsToFile();
            };
        };

        this.settingsToFile = () => {
            fs.mkdir(settingsPath, () => {
            });
            fs.writeFile(settingsFile, JSON.stringify(this.settings, null, 4), () => {
            });
        };

        this.loadSettingsFromFile = () => {
            fs.readFile(settingsFile, "ascii", this.setSettings);
        };

        this.setSettings = (err, data) => {
            this.settings = JSON.parse(data);
        };


    </script>
</settings-page>
