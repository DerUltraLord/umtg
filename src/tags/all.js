riot.tag2('about-page', '<p>About Page</p>', '', '', function(opts) {
});

riot.tag2('card-list', '<card each="{c in this.opts.cards}" card="{c}"></card>', 'card-list card:focus,[data-is="card-list"] card:focus{ background-color: var(--color-background-two); }', 'class="list-group scrollable"', function(opts) {
this.state = {
    "selectedCard": null,
    "selectedElement": null
};

this.on("data_loaded", function (cards) {
    this.opts.cards = cards;
    this.update();
});
});

riot.tag2('card-search', '<form class="cardSearchContainer" onsubmit="{onSearch}"> <label>Name:</label> <input placeholder="Name or Scryfall search" type="text" ref="searchName"></input> <label>Type:</label> <input placeholder="Creature" ref="searchType"></input> <label>Text:</label> <input placeholder="Oracle Text" ref="searchText"></input> <label>Edition:</label> <input placeholder="XLN" ref="searchEdition"></input> <div> <div> <button type="submit" class="btn btn-primary">Search</Search> </form>', 'card-search .cardSearchContainer,[data-is="card-search"] .cardSearchContainer{ display: grid; margin-top: 10px; margin-left: 10px; grid-gap: 10px; grid-template-columns: 60px 1fr; }', '', function(opts) {
var _this = this;

/* global scry */

this.onSearch = e => {
    e.preventDefault();

    let filter = scry.getSearchFilter(_this.refs.searchName.value, _this.refs.searchType.value, _this.refs.searchText.value, _this.refs.searchEdition.value);
    _this.opts.callback(filter);
};
});

riot.tag2('card', '<div class="media"> <div class="m20"> <img id="image{this.opts.card.id}" width="250" height="200"></img> <div> <div> <div class="btn-group btn-group-sm"> <button id="removeButton" onclick="{removeCardFromCollection}" class="btn btn-default delete" role="group"></button> <button id="lblAmount" class="btn btn-default" role="group">?</label> <button id="addButton" onclick="{addCardToCollection}" class="btn btn-default add" role="group"><span class="glyphicon glyphicon-search"></span></button> </div> <div class="btn-group btn-group-sm float-lg-right" role="group"> <button type="button" id="btnAddToDeck" onclick="{addCardToDeck}" class="btn btn-default plus"></button> <div class="btn-group btn-group-sm" role="group"> <button type="button" class="btn btn-default dropdown-toggle btnDeck" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">choose deck</button> <div class="dropdown-menu" aria-labelledby="btnDeck"> <a class="dropdown-item" each="{d in this.availableDecks}" onclick="{() => deckSelected(d)}">{d}</a> </div> </div> </div> </div> </div> </div> <div class="media-body"> <div class="row"> <h2 id="cardName{this.opts.card.id}" class="col-lg-8">{this.opts.card.name}</h2> <div id="cardMana{this.opts.card.id}" class="col-lg-4"></div> </div> <h3 id="cardType{this.opts.card.id}" class="cardType">{this.opts.card.type_line}</h3> <p class="cardText">{this.opts.card.oracle_text}</p> </div> <div>', 'card h2,[data-is="card"] h2{ overflow: hidden; font-size: 100%; font-weight: bold; } card h3,[data-is="card"] h3{ font-size: 90%; } card .m20,[data-is="card"] .m20{ margin-right: 20px; } card .plus:before,[data-is="card"] .plus:before{ content: "\\002B"; } card .add:before,[data-is="card"] .add:before{ content: "\\25B6"; } card .delete:before,[data-is="card"] .delete:before{ content: "\\25C0"; } card .cardMana,[data-is="card"] .cardMana{ grid-area: cardMana; text-align: right; margin-right: 10px; margin-top: 3px; } card .btnDeck,[data-is="card"] .btnDeck{ width: 120px; }', 'class="list-group-item"', function(opts) {
var _this = this;

/* global document, db, alert, $ */
this.availableDecks = ["one", "two"];
// TODO: move logic extra module (testable)

this.getTagsForMana = card => {

    let re = /\{\w\}/g;

    let res = "";

    let m;
    m = re.exec(card.mana_cost);
    while (m != null) {
        let manaString = m[0].substring(1, m[0].length - 1);
        manaString = `<svg class="icon24 float-lg-right" viewBox="0 0 600 600">
                    <use xlink:href="res/svg.svg#` + manaString + `"></use>
                    </svg>`;

        res = manaString + res;
        m = re.exec(card.mana_cost);
    }
    return res;
};

this.on("mount", function () {
    //var cardImage = document.getElementById("image" + this.opts.card.id);
    //if (this.opts.card.image_uris) {
    //    cardImage.setAttribute("src", this.opts.card.image_uris.art_crop);
    //}

    var cardName = document.getElementById("cardMana" + this.opts.card.id);
    cardName.insertAdjacentHTML("beforeend", this.getTagsForMana(this.opts.card));

    var colorIdentity = this.opts.card.color_identity;

    if (colorIdentity.length == 1) {
        var typeToAdd = "";
        if (colorIdentity[0] === "W") {
            typeToAdd = "warning";
        } else if (colorIdentity[0] === "U") {
            typeToAdd = "info";
        } else if (colorIdentity[0] === "B") {
            typeToAdd = "dark";
        } else if (colorIdentity[0] === "G") {
            typeToAdd = "success";
        } else if (colorIdentity[0] === "R") {
            typeToAdd = "danger";
        }
        this.root.classList.add("list-group-item-" + typeToAdd);

        var buttons = this.root.querySelectorAll("button");
        buttons.forEach(function (button) {
            button.classList.remove("btn-default");
            button.classList.add("btn-" + typeToAdd);
        });
    }

    //this.root.querySelector("#addButton").insertAdjacentHTML("beforeend", octicons.calendar.toSVG());

    this.update();
});

this.on("update", function () {
    if (this.opts.card.image_uris) {
        this.root.querySelector("img").setAttribute("src", this.opts.card.image_uris.art_crop);
    }
    db.getAmountOfCard(this.opts.card.id, this.updateAmount);
});

this.updateAmount = amount => {
    var lblAmount = _this.root.querySelector("#lblAmount");
    lblAmount.innerHTML = amount;
};

this.addCardToCollection = () => {
    db.cardAdjustAmount(_this.opts.card, 1, _this.update);
};

this.removeCardFromCollection = () => {
    db.cardAdjustAmount(_this.opts.card, -1, _this.update);
};

this.addCardToDeck = () => {
    alert(_this.opts.card);
};

this.deckSelected = d => {
    $(".btnDeck").html(d);
};
});

riot.tag2('collection-page', '<div class="scrollable leftContent"> <set-list callback="{onSetClicked}" sets="{this.opts.sets}"></set-list> </div> <div class="scrollable"> <card-list><card-list> </div>', 'collection-page { display: grid; grid-gap: 10px; grid-template-columns: 300px 1fr; }', '', function(opts) {
var _this = this;

/* globals db, scry, utils */

this.currentSet = null;

this.on("mount", () => {
    db.getSets(_this.checkIfSetsAreInDb);
});

this.checkIfSetsAreInDb = res => {
    if (res.length == 0) {
        scry.scryfallGetSets(_this.onSetsFromScryfall);
    }
    _this.onGetSetsFromDb(res);
};

this.onGetSetsFromDb = res => {
    var sets = [];
    for (var i = 0; i < res.length; ++i) {
        var set = JSON.parse(res[i].jsonString);
        sets.push(set);
    }
    _this.opts.sets = sets;

    _this.tags["set-list"].update();
    if (_this.tags["card-list"].opts.cards == undefined) {
        var setToShow = _this.tags["set-list"].tags["set"][0];
        _this.showCardsOfSet(setToShow.opts.set);
    }
};

this.onSetsFromScryfall = res => {
    res.data.forEach(function (set) {
        db.setAdd(set);
    });
    db.getSets(_this.onGetSetsFromDb);
};

this.showCardsOfSet = set => {
    _this.currentSet = set;
    db.getCardsOfSet(set, _this.onCardsFromDb);
};

this.onCardsFromDb = res => {
    if (res.length < _this.currentSet.card_count) {
        utils.getJSON(_this.currentSet.search_uri, _this.onCardsFromScryfall);
    } else {
        _this.showCards(res);
    }
};

this.onCardsFromScryfall = res => {
    for (var i = 0; i < res.data.length; ++i) {
        var card = res.data[i];
        db.cardAdd(card, 0);
    }

    if (res.has_more == true) {
        utils.getJSON(res.next_page, _this.onCardsFromScryfall);
    } else {
        db.getCardsOfSet(_this.currentSet, _this.onCardsFromDb);
    }
};

this.showCards = cards => {
    _this.tags["card-list"].opts.cards = cards;
    _this.tags["card-list"].update();
};

this.onSetClicked = set => {
    _this.showCardsOfSet(set);
};
});

riot.tag2('deck-list', '<deck id="{index}" class="list-group-item" each="{d, index in this.opts.decks}" deck="{d}" onclick="{() => onClick(index)}"></deck>', '', 'class="list-group"', function(opts) {
var _this = this;

/* globals $, events */

this.onClick = index => {
    let selectionClassName = "list-group-item-info";
    $("deck." + selectionClassName).removeClass(selectionClassName);
    let element = _this.tags["deck"][index];
    element.root.classList.add(selectionClassName);
    events.trigger("deck:onClick", element);
};
});

riot.tag2('decks-page', '<span show="{this.decks == null || this.decks.length == 0}" class="badge badge-warning">No decks found.<br>Copy decklist text files into ~/.umtg/decks<br>and reload</span> <div class="scrollable"> <deck-list decks="{this.decks}" selecteddeck="{this.selectedDeck}" callback="{onDeckClicked}"></deck-list> </div> <div class="scrollable"> <card-list></card-list> </div> </div>', 'decks-page { display: grid; grid-gap: 10px; grid-template-columns: 300px 1fr; }', '', function(opts) {
var _this = this;

/* globals deck, events */
var self = this;
this.decks = [];
this.selectedDeck = null;

this.on("mount", () => {
    _this.decks = deck.getDecks(_this.setDecks);
});

this.on("update", () => {
    if (_this.selectedDeck == null && _this.decks.length > 0) {
        _this.selectedDeck = _this.decks[0];
    }
});

this.setDecks = decks => {
    _this.decks = decks;
};

this.showCardsOfDeck = d => {
    var cards = [];
    var cardList = _this.tags["card-list"];
    deck.getCardsOfDeck(d.name, function (card) {
        cards.push(card);
        cardList.opts.cards = cards;
        cardList.update();
    });
    _this.visibleDeck = d;
};

events.on("deck:onClick", function (element) {
    self.showCardsOfDeck(element.opts.deck);
});
});

riot.tag2('deck', '<p>{this.opts.deck.name}</p>', '', '', function(opts) {
});

riot.tag2('navigation', '<nav class="navbar navbar-expand-lg navbar-dark bg-dark"> <a class="navbar-brand" href="#">UMTG</a> <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation"> <span class="navbar-toggler-icon"></span> </button> <div class="collapse navbar-collapse" id="navbarNavAltMarkup"> <div class="navbar-nav"> <a id="navPage{pageKey}" class="nav-item nav-link" onclick="{onClick(pageKey)}" each="{pageKey in this.opts.pages}" href="#">{pageKey}</a> </div> </div> </nav>', 'navigation { background: linear-gradient(var(--color-header), black); color: white; } navigation ul,[data-is="navigation"] ul{ list-style-type: none; margin: 0; padding: 0; overflow: hidden; } navigation li,[data-is="navigation"] li{ float: left; } navigation a,[data-is="navigation"] a{ display: block; text-align: center; padding: 14px 16px; text-decoration: none; color: var(--color--background); } navigation li:hover,[data-is="navigation"] li:hover{ background-color: var(--color-background); color: var(--color-font-fg); } navigation li.active:hover,[data-is="navigation"] li.active:hover{ } navigation li.active,[data-is="navigation"] li.active{ background-color: var(--color-background); background: linear-gradient(var(--color-background), darkgray); color: var(--color-font-fg); } navigation .navLogo,[data-is="navigation"] .navLogo{ font-weight: bold; }', 'class="header"', function(opts) {


        this.onClick = page => {
            return () => {
                this.opts.onPageSelected(page);
                var elements = document.getElementsByClassName("nav-item");
                for (var i = 0; i < elements.length; ++i) {
                    elements[i].classList.remove("active");
                    if (elements[i].id == "navPage" + page) {
                        elements[i].classList.add("active");
                    }

                }

            };
        };

        this.on("mount", () => {
            var elements = document.getElementsByClassName("nav-item");
            elements[0].classList.add("active");
        });

});

riot.tag2('search-page', '<card-search class="leftContent" callback="{onSearchEntered}"></card-search> <card-list></card-list>', 'search-page { height: 100%; display: grid; grid-gap: 10px; grid-template-columns: 300px 3fr; }', '', function(opts) {
var _this = this;

/* global riot, scry */
riot.mount("card-search");
riot.mount("card-list");

this.onSearchEntered = filter => {
    //scry.search(searchText, this.onDataAvailable, this.onDataNotAvailable)
    scry.searchByFilter(filter, _this.onDataAvailable, _this.onDataNotAvailable);
};

this.onDataAvailable = data => {
    _this.tags["card-list"].opts.cards = data.data;
    _this.tags["card-list"].update();
};

this.onDataNotAvailable = () => {
    _this.tags["card-list"].trigger("data_loaded", {});
};
});

riot.tag2('set-list', '<set code="{s.code}" if="{this.setTypes[s.set_type]}" onclick="{() => onSetClick(index, s)}" each="{s, index in this.opts.sets}" set="{s}"></set>', '', 'class="list-group scrollable"', function(opts) {
var _this = this;

/* global document, $ */

this.setTypes = null;

this.on("update", () => {
    _this.setTypes = document.getElementsByTagName("settings-page")[0]._tag.settings.setTypes;

    var sets = $(_this.root).children();
    if (sets.length > 0) {
        if (sets.filter(".list-group-item-info").length == 0) {
            $(sets[0]).toggleClass("list-group-item-info");
        }
    }
});

this.onSetClick = (index, set) => {
    let selectionClassName = "list-group-item-info";
    let tagSet = _this.tags["set"][index];
    $("set." + selectionClassName).removeClass(selectionClassName);
    tagSet.root.classList.add(selectionClassName);
    _this.opts.callback(set);
};
});

riot.tag2('set', '<div class="row"> <div class="col-2"> <img class="" riot-src="{this.opts.set.icon_svg_uri}"></img> </div> <div class="col-10"> <span class="badge badge-default">{this.opts.set.name}</span> <div class="progress"> <div class="progress-bar" role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100"></div> </div> </div>', 'set img,[data-is="set"] img{ width: 20px; height: 20px; margin-left: 5px; }', 'class="list-group-item"', function(opts) {
});

riot.tag2('settings-page', '<p>Settings Page</p> <ul> <li each="{value, name in settings.setTypes}"> <input onclick="{onSetTypeClicked()}" type="checkbox" riot-value="{name}" checked="{value}">{name}</input> </li> <ul>', '', '', function(opts) {
var _this = this;

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

this.on("mount", function () {
    this.loadSettingsFromFile();
    this.update();
});

this.onSetTypeClicked = () => {
    return e => {
        _this.settings.setTypes[e.srcElement.value] = e.srcElement.checked;
        _this.settingsToFile();
    };
};

this.settingsToFile = () => {
    fs.mkdir(settingsPath, () => {});
    fs.writeFile(settingsFile, JSON.stringify(_this.settings, null, 4), () => {});
};

this.loadSettingsFromFile = () => {
    fs.readFile(settingsFile, "ascii", _this.setSettings);
};

this.setSettings = (err, data) => {
    _this.settings = JSON.parse(data);
};
});
