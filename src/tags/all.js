riot.tag2('about-page', '<p>About Page</p>', '', '', function(opts) {
});

riot.tag2('card-list', '<card onclick="{onClick(c)}" each="{c in this.opts.cards}" card="{c}"></card>', 'card-list card:focus,[data-is="card-list"] card:focus{ background-color: var(--color-background-two); }', 'class="list-group scrollable"', function(opts) {

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

riot.tag2('card-search', '<form class="cardSearchContainer" onsubmit="{onSearch}"> <label>Name:</label> <input placeholder="Name or Scryfall search" type="text" ref="searchName"></input> <label>Type:</label> <input placeholder="Creature" ref="searchType"></input> <label>Text:</label> <input placeholder="Oracle Text" ref="searchText"></input> <label>Edition:</label> <input placeholder="XLN" ref="searchEdition"></input> <div> <div> <button type="submit" class="btn btn-primary">Search</Search> </form>', 'card-search .cardSearchContainer,[data-is="card-search"] .cardSearchContainer{ display: grid; margin-top: 10px; margin-left: 10px; grid-gap: 10px; grid-template-columns: 60px 1fr; }', '', function(opts) {
        this.onSearch = function(e) {
            e.preventDefault();

            filter = scry.getSearchFilter(this.refs.searchName.value,
                                          this.refs.searchType.value,
                                          this.refs.searchText.value,
                                          this.refs.searchEdition.value)
            this.opts.callback(filter);
        }.bind(this)
});

riot.tag2('card', '<div class="media"> <div class="m20"> <img id="image{this.opts.card.id}" width="250" height="200"></img> <div> <div> <div class="btn-group btn-group-sm"> <button id="removeButton" onclick="{removeCardFromCollection}" class="btn btn-default delete" role="group"></button> <button id="lblAmount" class="btn btn-default" role="group">?</label> <button id="addButton" onclick="{addCardToCollection}" class="btn btn-default add" role="group"><span class="glyphicon glyphicon-search"></span></button> </div> <div class="btn-group btn-group-sm float-lg-right" role="group"> <button type="button" id="btnAddToDeck" onclick="{addCardToDeck}" class="btn btn-default plus"></button> <div class="btn-group btn-group-sm" role="group"> <button id="btnDeck" type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> MyDeck </button> <div class="dropdown-menu" aria-labelledby="btnDeck"> <a class="dropdown-item" href="#">foo</a> <a class="dropdown-item" href="#">foo</a> </div> </div> </div> </div> </div> </div> <div class="media-body"> <div class="row"> <h2 id="cardName{this.opts.card.id}" class="col-lg-8">{this.opts.card.name}</h2> <div id="cardMana{this.opts.card.id}" class="col-lg-4"></div> </div> <h3 id="cardType{this.opts.card.id}" class="cardType">{this.opts.card.type_line}</h3> <p class="cardText">{this.opts.card.oracle_text}</p> </div> <div>', 'card h2,[data-is="card"] h2{ overflow: hidden; font-size: 100%; font-weight: bold; } card h3,[data-is="card"] h3{ font-size: 90%; } card .m20,[data-is="card"] .m20{ margin-right: 20px; } card .plus:before,[data-is="card"] .plus:before{ content: "\\002B"; } card .add:before,[data-is="card"] .add:before{ content: "\\25B6"; } card .delete:before,[data-is="card"] .delete:before{ content: "\\25C0"; } card .cardMana,[data-is="card"] .cardMana{ grid-area: cardMana; text-align: right; margin-right: 10px; margin-top: 3px; }', 'class="list-group-item"', function(opts) {
        var db = require("./src/db.js");

        this.getTagsForMana = function(card) {

            var re = /\{\w\}/g;

            res = '';

            while (m = re.exec(card.mana_cost)) {
                var manaString = m[0].substring(1, m[0].length -1);
                manaString = `<svg class="icon24 float-lg-right" viewBox="0 0 600 600">
                    <use xlink:href="res/svg.svg#` + manaString + `"></use>
                    </svg>`

                res = manaString + res;
            }
            return res;
        }.bind(this);

        this.on('mount', function() {

            var cardName = document.getElementById("cardMana" + this.opts.card.id);
            cardName.insertAdjacentHTML('beforeend', this.getTagsForMana(this.opts.card));

            var colorIdentity = this.opts.card.color_identity;

            if (colorIdentity.length == 1) {
                var typeToAdd = '';
                if (colorIdentity[0] === "W") {
                    typeToAdd = 'warning';
                } else if (colorIdentity[0] === "U") {
                    typeToAdd = 'info';
                } else if (colorIdentity[0] === "B") {
                    typeToAdd = 'dark';
                } else if (colorIdentity[0] === "G") {
                    typeToAdd = 'success';
                } else if (colorIdentity[0] === "R") {
                    typeToAdd = 'danger';
                }
                this.root.classList.add("list-group-item-" + typeToAdd);

                var buttons = this.root.querySelectorAll('button');
                buttons.forEach(function(button) {
                    button.classList.remove('btn-default');
                    button.classList.add('btn-' + typeToAdd);
                });
            }

            this.update();
        });

        this.on("update", function() {
            if (this.opts.card.image_uris) {
                this.root.querySelector('img').setAttribute('src', this.opts.card.image_uris.art_crop);
            }
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

        this.currentSet = null;

        this.on('mount', function() {
            db.getSets(this.checkIfSetsAreInDb);
        });

        this.checkIfSetsAreInDb = function(res) {
            if (res.length == 0) {
                scry.scryfallGetSets(this.onSetsFromScryfall);
            }
            this.onGetSetsFromDb(res);
        }.bind(this)

        this.onGetSetsFromDb = function(res) {
            var sets = [];
            for (var i = 0; i < res.length; ++i) {
                var code = res[i].code;
                var set = JSON.parse(res[i].jsonString);
                sets.push(set);
            }
            opts.sets = sets;

            this.tags['set-list'].update();
            if (this.tags['card-list'].opts.cards == undefined) {
                var setToShow = this.tags['set-list'].tags['set'][0];
                setToShow.root.classList.add('selected');
                this.showCardsOfSet(setToShow.opts.set);

            }
        }.bind(this)

        this.onSetsFromScryfall = function(res) {
            res.data.forEach(function(set) {
                db.setAdd(set);
            });
            db.getSets(this.onGetSetsFromDb);
        }.bind(this)

        this.showCardsOfSet = function(set) {
            var setList = this.tags['set-list'].root;
            this.currentSet = set;
            var selectedItem = setList.querySelector('.selected')
            if (selectedItem) {
                selectedItem.classList.remove('selected');
            }

            setList.querySelector('set[code="' + set.code + '"]').classList.add('selected')
            db.getCardsOfSet(set, this.onCardsFromDb);

        }.bind(this)

        this.onCardsFromDb = function(res) {
            if (res.length < this.currentSet.card_count) {
                getJSON(this.currentSet.search_uri, this.onCardsFromScryfall);
            } else {
                console.log("set already stored " + this.currentSet.name);
                this.showCards(res);
                console.log(res);
            }
        }.bind(this)

        this.onCardsFromScryfall = function(res) {
            for (var i = 0; i < res.data.length; ++i) {
                var card = res.data[i];
                db.cardAdd(card, 0);
            }

            if (res.has_more == true) {
                getJSON(res.next_page, this.onCardsFromScryfall);
            } else {
                db.getCardsOfSet(this.currentSet, this.onCardsFromDb);
            }

        }.bind(this)

        this.showCards = function(cards) {
            this.tags['card-list'].opts.cards = cards;
            this.tags['card-list'].update();
        }.bind(this)

        this.onSetClicked = function(set) {
            this.showCardsOfSet(set);
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

riot.tag2('navigation', '<nav class="navbar navbar-expand-lg navbar-dark bg-dark"> <a class="navbar-brand" href="#">UMTG</a> <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation"> <span class="navbar-toggler-icon"></span> </button> <div class="collapse navbar-collapse" id="navbarNavAltMarkup"> <div class="navbar-nav"> <a id="navPage{pageKey}" class="nav-item nav-link" onclick="{onClick(pageKey)}" each="{pageKey in this.opts.pages}" href="#">{pageKey}</a> </div> </div> </nav>', 'navigation { background: linear-gradient(var(--color-header), black); color: white; } navigation ul,[data-is="navigation"] ul{ list-style-type: none; margin: 0; padding: 0; overflow: hidden; } navigation li,[data-is="navigation"] li{ float: left; } navigation a,[data-is="navigation"] a{ display: block; text-align: center; padding: 14px 16px; text-decoration: none; color: var(--color--background); } navigation li:hover,[data-is="navigation"] li:hover{ background-color: var(--color-background); color: var(--color-font-fg); } navigation li.active:hover,[data-is="navigation"] li.active:hover{ } navigation li.active,[data-is="navigation"] li.active{ background-color: var(--color-background); background: linear-gradient(var(--color-background), darkgray); color: var(--color-font-fg); } navigation .navLogo,[data-is="navigation"] .navLogo{ font-weight: bold; }', 'class="header"', function(opts) {
        this.onClick = function(page) {
            return function(e) {
                this.opts.onPageSelected(page)
                var elements = document.getElementsByClassName("nav-item");
                for (var i = 0; i < elements.length; ++i) {
                    elements[i].classList.remove("active");
                    if (elements[i].id == "navPage" + page) {
                        elements[i].classList.add("active");
                    }

                }

            }
        }.bind(this)

        this.on("mount", function () {
            var elements = document.getElementsByClassName("nav-item");
            elements[0].classList.add("active")
        });
});

riot.tag2('search-page', '<card-search class="leftContent" callback="{onSearchEntered}"></card-search> <card-list></card-list>', 'search-page { height: 100%; display: grid; grid-gap: 10px; grid-template-columns: 300px 3fr; }', '', function(opts) {
        riot.mount('card-search');
        riot.mount('card-list');

        this.onSearchEntered = function(filter) {

            scry.searchByFilter(filter, this.onDataAvailable, this.onDataNotAvailable);

        }.bind(this)

        this.onDataAvailable = function(data) {
            console.log(data);

            this.tags['card-list'].opts.cards = data.data;
            this.tags['card-list'].update();

        }.bind(this)

        this.onDataNotAvailable = function() {
            this.tags['card-list'].trigger('data_loaded', {});

        }.bind(this)

});

riot.tag2('set-list', '<set code="{s.code}" tabindex="0" if="{this.setTypes[s.set_type]}" onclick="{onSetClick(s)}" each="{s in this.opts.sets}" set="{s}"></set>', 'set-list set:focus,[data-is="set-list"] set:focus{ } set-list set:active,[data-is="set-list"] set:active{ } set-list set.selected,[data-is="set-list"] set.selected{ border: 1px solid black; outline: 0; }', '', function(opts) {

        this.setTypes = null;

        this.on('update', function() {
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
