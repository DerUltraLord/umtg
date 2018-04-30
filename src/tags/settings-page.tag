<settings-page>
    <p>Settings Page</p>
    <ul>
        <li each="{ value, name in settings.setTypes }">
            <input onClick={ onSetTypeClicked() } type="checkbox" value={ name } checked={ value }>{ name }</input>
        </li>
    <ul>
    <script>
        var fs = require('fs');
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

        this.on('update', function() {
            console.log("update");
            console.log(this.settings);
        });

        this.on('mount', function() {
            this.loadSettingsFromFile();
            this.update();
        });

        onSetTypeClicked() {
            return function(e) {
                this.settings.setTypes[e.srcElement.value] = e.srcElement.checked;
                this.settingsToFile();
            }
        }

        settingsToFile() {
            fs.mkdir(settingsPath, function(err) {
            });
            fs.writeFile(settingsFile, JSON.stringify(this.settings, null, 4), function(err) {
                console.log(err);
            });
        }

        loadSettingsFromFile() {
            var settings = this.settings;
            fs.readFile(settingsFile, 'ascii', this.setSettings);
        }

        setSettings(err, data) {
            this.settings = JSON.parse(data);
        }


    </script>
</settings-page>
