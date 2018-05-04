riot.tag2('about-page', '<p>About Page</p>', '', '', function(opts) {
});

riot.tag2('card-list', '<card tabindex="0" onclick="{onClick(c)}" each="{c in this.opts.cards}" card="{c}"></card>', 'card-list card:focus,[data-is="card-list"] card:focus{ background-color: var(--color-background-two); }', '', function(opts) {

        this.findParentNode = function(node, tagName) {
            while(node) {
                if (node.tagName.toUpperCase() === tagName.toUpperCase()) {
                    return node;
                }
                node = node.parentNode;
            }
            return null;
        }.bind(this)

        this.state = {
            "selectedCard": null,
            "selectedElement": null
        }

        this.onClick = function(card) {
            return function(e) {

            }
        }.bind(this)

        this.on('data_loaded', function(cards) {
            opts.cards = cards;
            this.update();
        });

});

riot.tag2('card-search', '<form class="cardSearchContainer" onsubmit="{onSearch}"> <label>Name:</label> <input placeholder="Name or Scryfall search" type="text" ref="searchName"></input> <label>Type:</label> <input placeholder="Creature" ref="searchType"></input> <label>Text:</label> <input placeholder="Oracle Text" ref="searchText"></input> <label>Edition:</label> <input placeholder="XLN" ref="searchEdition"></input> <div> <div> <button>Search</Search> </form>', 'card-search .cardSearchContainer,[data-is="card-search"] .cardSearchContainer{ display: grid; margin-top: 10px; margin-left: 10px; grid-gap: 10px; grid-template-columns: 60px 1fr; }', '', function(opts) {
        this.onSearch = function(e) {
            e.preventDefault();

            filter = scry.getSearchFilter(this.refs.searchName.value,
                                          this.refs.searchType.value,
                                          this.refs.searchText.value,
                                          this.refs.searchEdition.value)
            this.opts.callback(filter);
        }.bind(this)
});

riot.tag2('card', '<img id="image{this.opts.card.id}" class="cardImage" width="200px"></img> <h2 id="cardName{this.opts.card.id}" class="cardName">{this.opts.card.name}</h2> <div id="cardMana{this.opts.card.id}" class="cardMana"></div> <h3 id="cardType{this.opts.card.id}" class="cardType">{this.opts.card.type_line}</h3> <p class="cardText">{this.opts.card.oracle_text}</p> <div class="cardActions"> <button id="removeButton" onclick="{removeCardFromCollection}" class="cardButton">-</button> <label id="lblAmount">0</label> <button id="addButton" onclick="{addCardToCollection}" class="cardButton">+</button> <button id="btnAddToDeck" onclick="{addCardToDeck}" class="cardButton">add to deck</button> </div>', 'card { display: grid; grid-gap: 10px; grid-template-columns: 200px 1fr 100px; grid-template-rows: 20px 20px 1fr 40px; grid-template-areas: "cardImage cardName cardMana" "cardImage cardType cardType" "cardImage cardText cardText" "cardImage cardActions cardActions"; border-bottom: 2px solid #3c3836; margin-top: 10px; margin-bottom: 10px; } card .cardButton,[data-is="card"] .cardButton{ color: green; padding-top: 0px; padding-bottom: 0px; padding-left: 5px; padding-right: 5px; border: 2px solid green; } card .cardImage,[data-is="card"] .cardImage{ grid-area: cardImage; } card .cardName,[data-is="card"] .cardName{ grid-area: cardName; } card .cardType,[data-is="card"] .cardType{ grid-area: cardType; } card .cardText,[data-is="card"] .cardText{ grid-area: cardText; } card .cardActions,[data-is="card"] .cardActions{ grid-area: cardActions; } card .cardMana,[data-is="card"] .cardMana{ grid-area: cardMana; text-align: right; margin-right: 10px; margin-top: 3px; }', '', function(opts) {
        var db = require("./src/db.js");

        this.getTagsForMana = function(card) {

            var re = /\{\w\}/g;

            res = '';

            while (m = re.exec(card.mana_cost)) {
                var manaString = m[0].substring(1, m[0].length -1);
                manaString = `<svg class="icon24" viewBox="0 0 600 600">
                    <use xlink:href="res/svg.svg#` + manaString + `"></use>
                    </svg>`

                res += manaString;
            }
            return res;
        }.bind(this);

        this.on('mount', function() {
            var cardImage = document.getElementById("image" + this.opts.card.id);
            if (this.opts.card.image_uris) {
                cardImage.setAttribute('src', this.opts.card.image_uris.art_crop);
            }

            var cardName = document.getElementById("cardMana" + this.opts.card.id);
            cardName.insertAdjacentHTML('beforeend', this.getTagsForMana(this.opts.card));

            this.update();
        });

        this.on("update", function() {
            db.getAmountOfCard(this.opts.card.id, this.updateAmount);
        });

        this.updateAmount = function(amount) {
            var lblAmount = this.root.querySelector("#lblAmount");
            lblAmount.innerHTML = amount;
        }.bind(this)

        this.addCardToCollection = function() {
            db.cardAdjustAmount(this.opts.card, 1, this.update);
        }.bind(this)

        this.removeCardFromCollection = function() {
            db.cardAdjustAmount(this.opts.card, -1, this.update);
        }.bind(this)
});

riot.tag2('collection-page', '<div class="scrollable leftContent"> <set-list callback="{onSetClicked}" sets="{this.opts.sets}"></set-list> </div> <div class="scrollable"> <card-list><card-list> </div>', 'collection-page { display: grid; grid-gap: 10px; grid-template-columns: 300px 1fr; }', '', function(opts) {


        this.on('update', function() {
            scry.scryfallGetSets(this.onSets);
        });

        this.onSets = function(res) {
            opts.sets = res.data;
            this.tags['set-list'].update();

            this.showSet(opts.sets[0]);
            console.log(opts.sets[0]);
        }.bind(this)

        this.showSet = function(set) {
            getJSON(set.search_uri, this.onSet);
        }.bind(this)

        this.onSet = function(res) {
            this.tags['card-list'].opts.cards = res.data;
            this.tags['card-list'].update();
        }.bind(this)

        this.onSetClicked = function(set) {
            this.showSet(set);
        }.bind(this)

});

riot.tag2('decks-page', '<div class="box scrollable"> <label tabindex="0" onclick="{onClick(d)}" each="{d in this.decks}">{d.name}</label> </div> <div class="box scrollable"> <card-list></card-list> </div>', 'decks-page { display: grid; grid-gap: 10px; grid-template-columns: 250px 1fr; }', 'class="fullHeight"', function(opts) {
        this.decks = []
        this.on('mount', function() {
            this.decks = deck.getDecks(this.setDecks);
        });

        this.setDecks = function(decks) {
            this.decks = decks;
        }.bind(this);

        this.onClick = function(d) {
            return function(e) {
                var cards = []
                var cardList = this.parent.tags['card-list'];
                deck.getCardsOfDeck(d.name, function(card) {
                    cards.push(card);
                    cardList.opts.cards = cards;
                    cardList.update();
                });
            }
        }.bind(this)
});

riot.tag2('navigation', '<ul> <li> <a class="navLogo" href="#">UMTG</a> <li> <li id="navPage{pageKey}" class="navElement" each="{pageKey in this.opts.pages}" id="nav{pageKey}" onclick="{parent.onClick(pageKey)}"> <a href="#">{pageKey}</a> </li> </ul>', 'navigation { background: linear-gradient(var(--color-header), black); color: white; } navigation ul,[data-is="navigation"] ul{ list-style-type: none; margin: 0; padding: 0; overflow: hidden; } navigation li,[data-is="navigation"] li{ float: left; } navigation a,[data-is="navigation"] a{ display: block; text-align: center; padding: 14px 16px; text-decoration: none; color: var(--color--background); } navigation li:hover,[data-is="navigation"] li:hover{ background-color: var(--color-background); color: var(--color-font-fg); } navigation li.active:hover,[data-is="navigation"] li.active:hover{ } navigation li.active,[data-is="navigation"] li.active{ background-color: var(--color-background); background: linear-gradient(var(--color-background), darkgray); color: var(--color-font-fg); } navigation .navLogo,[data-is="navigation"] .navLogo{ font-weight: bold; }', 'class="header"', function(opts) {
        this.onClick = function(page) {
            return function(e) {
                this.opts.onPageSelected(page)
                var elements = document.getElementsByClassName("navElement");
                for (var i = 0; i < elements.length; ++i) {
                    elements[i].classList.remove("active");
                    if (elements[i].id == "navPage" + page) {
                        elements[i].classList.add("active");
                    }

                }

            }
        }.bind(this)

        this.on("mount", function () {
            var elements = document.getElementsByClassName("navElement");
            elements[0].classList.add("active")
        });
});

riot.tag2('search-page', '<card-search class="leftContent" callback="{onSearchEntered}"></card-search> <card-list class="scrollable" id="cardResult"></card-list>', 'search-page { display: grid; height: 100%; grid-gap: 10px; grid-template-columns: 300px 3fr; }', '', function(opts) {
        riot.mount('card-search');
        riot.mount('card-list');

        this.onSearchEntered = function(filter) {

            scry.searchByFilter(filter, this.onDataAvailable, this.onDataNotAvailable);

        }.bind(this)

        this.onDataAvailable = function(data) {
            console.log(data);
            this.tags['card-list'].trigger('data_loaded', data.data);

        }.bind(this)

        this.onDataNotAvailable = function() {
            this.tags['card-list'].trigger('data_loaded', {});

        }.bind(this)

});

riot.tag2('set-list', '<set tabindex="0" if="{this.setTypes[s.set_type]}" onclick="{onSetClick(s)}" each="{s in this.opts.sets}" set="{s}"></set>', 'set-list set:focus,[data-is="set-list"] set:focus{ border: 1px solid black; outline: 0; }', '', function(opts) {

        this.setTypes = null;

        this.on('update', function() {
            console.log("set list update");
            this.setTypes = document.getElementsByTagName('settings-page')[0]._tag.settings.setTypes;
        });

        this.onSetClick = function(set) {
            var callback = this.opts.callback;
            return function(e) {
                callback(set);
            }
        }.bind(this)
});

riot.tag2('set', '<img riot-src="{this.opts.set.icon_svg_uri}"></img> <div class="progress" data-label="{this.opts.set.name}"> <span class="value" style="width:20%;"></span> </div>', 'set { display: grid; grid-gap: 0px; grid-template-columns: 40px 1fr; height: 30px; background-color: var(--color-background-two); } set img,[data-is="set"] img{ width: 20px; height: 20px; margin-left: 5px; } set .progress,[data-is="set"] .progress{ margin-top: 1px; height: 29px; width: 100%; background-color: #c9c9c9; position: relative; } set .progress:before,[data-is="set"] .progress:before{ content: attr(data-label); position: absolute; text-align: left; top: 5px; left: 0; right: 0; margin-left: 10px; } set .progress .value,[data-is="set"] .progress .value{ background-color: #7cc4ff; display: inline-block; height: 100%; }', '', function(opts) {
});

riot.tag2('settings-page', '<p>Settings Page</p> <ul> <li each="{value, name in settings.setTypes}"> <input onclick="{onSetTypeClicked()}" type="checkbox" riot-value="{name}" checked="{value}">{name}</input> </li> <ul>', '', '', function(opts) {
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

        this.onSetTypeClicked = function() {
            return function(e) {
                this.settings.setTypes[e.srcElement.value] = e.srcElement.checked;
                this.settingsToFile();
            }
        }.bind(this)

        this.settingsToFile = function() {
            fs.mkdir(settingsPath, function(err) {
            });
            fs.writeFile(settingsFile, JSON.stringify(this.settings, null, 4), function(err) {
                console.log(err);
            });
        }.bind(this)

        this.loadSettingsFromFile = function() {
            var settings = this.settings;
            fs.readFile(settingsFile, 'ascii', this.setSettings);
        }.bind(this)

        this.setSettings = function(err, data) {
            this.settings = JSON.parse(data);
        }.bind(this)

});
