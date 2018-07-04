riot.tag2('about-page', '<p>About Page</p>', '', 'class="page"', function(opts) {
});

riot.tag2('card-list', '<card each="{c in this.opts.cards}" card="{c}" grid="{settings.isGridActive()}"></card>', 'card-list card:focus,[data-is="card-list"] card:focus{ background-color: var(--color-background-two); }', 'class="{settings.isGridActive() ? \'d-flex flex-row flex-wrap\' : \'list-group-item\'}"', function(opts) {

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

riot.tag2('card', '<div show="{!this.opts.grid}" class="media"> <div class="m20"> <img id="image{this.opts.card.id}" width="250" height="200"></img> <div> <picture-buttons card="{this.opts.card}"></picture-buttons> </div> </div> <div class="media-body"> <div class="row"> <h2 id="cardName{this.opts.card.id}" class="col-lg-8">{this.opts.card.name}</h2> <div id="cardMana{this.opts.card.id}" class="col-lg-4"></div> </div> <h3 id="cardType{this.opts.card.id}" class="cardType">{this.opts.card.type_line}</h3> <p class="cardText">{this.opts.card.oracle_text}</p> </div> </div> <div show="{this.opts.grid}"> <div class="container"> <div class="row"> <div class="col"> <img width="250" riot-src="{this.opts.card.image_uris ? this.opts.card.image_uris.normal : null}"></img> </div> </div> <div class="row mt10"> <div class="col"> <picture-buttons card="{this.opts.card}"></picture-buttons> </div> </div> </div> </div>', 'card h2,[data-is="card"] h2{ overflow: hidden; font-size: 100%; font-weight: bold; } card h3,[data-is="card"] h3{ font-size: 90%; } card .m20,[data-is="card"] .m20{ margin-right: 20px; } card .mt10,[data-is="card"] .mt10{ margin-top: 10px; } card .textOverflowHidden,[data-is="card"] .textOverflowHidden{ overflow: hidden; text-overflow: ellipsis; white-space: nowrap; } card .plus:before,[data-is="card"] .plus:before{ content: "\\002B"; } card .add:before,[data-is="card"] .add:before{ content: "\\25B6"; } card .delete:before,[data-is="card"] .delete:before{ content: "\\25C0"; } card .btnDeck,[data-is="card"] .btnDeck{ width: 120px; }', 'class="{this.grid ? \'\' : \'list-group-item\'}"', function(opts) {
var _this = this;

/* global deck, document, db, alert, $ */

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

    if (!this.grid) {

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
    }

    //this.root.querySelector("#addButton").insertAdjacentHTML("beforeend", octicons.calendar.toSVG());
});

this.on("update", function () {
    if (this.opts.card.image_uris) {
        this.root.querySelector("img").setAttribute("src", this.opts.card.image_uris.art_crop);
    }
});

this.addCardToDeck = () => {
    alert(_this.opts.card);
};
});

riot.tag2('collection-page', '<div class="scrollable leftContent"> <set-list callback="{showCardsOfSet}" sets="{this.opts.sets}"></set-list> </div> <div class="scrollable"> <card-list><card-list> </div> <loader></loader>', 'collection-page { display: grid; grid-gap: 10px; grid-template-columns: 300px 1fr; }', 'class="page"', function(opts) {
var _this = this;

/* globals db, scry */

this.currentSet = null;

this.on("mount", () => {
    db.getSets().then(sets => {
        if (sets.length == 0) {
            scry.scryfallGetSets().then(_this.onSetsFromScryfall);
        } else {
            _this.onGetSetsFromDb(sets);
        }
    });
});

this.onGetSetsFromDb = res => {
    _this.opts.sets = res;
    _this.tags["set-list"].update();
    if (_this.tags["card-list"].opts.cards == undefined) {
        var setToShow = _this.tags["set-list"].tags["set"][0];
        _this.showCardsOfSet(setToShow.opts.set);
    }
};

this.onSetsFromScryfall = res => {
    res.data.forEach(set => {
        db.setAdd(set);
    });
    db.getSets().then(_this.onGetSetsFromDb);
};

this.showCardsOfSet = set => {
    _this.currentSet = set;
    _this.tags['loader'].show();
    db.getCardsOfSet(set).then(_this.onCardsFromDb);
};

this.onCardsFromDb = res => {
    if (res.length < _this.currentSet.card_count) {
        base.getJSON(_this.currentSet.search_uri).then(_this.onCardsFromScryfall);
    } else {
        _this.showCards(res);
        _this.tags['loader'].hide();
    }
};

this.onCardsFromScryfall = res => {
    for (var i = 0; i < res.data.length; ++i) {
        var card = res.data[i];
        db.cardAdd(card, 0);
    }

    if (res.has_more == true) {
        base.getJSON(res.next_page).then(_this.onCardsFromScryfall);
    } else {
        db.getCardsOfSet(_this.currentSet).then(_this.onCardsFromDb);
    }
};

this.showCards = cards => {
    _this.tags["card-list"].opts.cards = cards;
    _this.tags["card-list"].update();
};

events.on('settingsUpdate', this.update);
});

riot.tag2('deck-add-buttons', '<div class="btn-group btn-group-lg float-lg-left" role="group"> <button type="button" id="btnAddToDeck" onclick="{addCardToDeck}" class="btn btn-default">+</button> <div class="btn-group btn-group-sm dropup" role="group"> <button type="button" class="textOverflowHidden btn btn-default dropdown-toggle btnDeck w300 text-left" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">choose deck</button> <div class="dropdown-menu" aria-labelledby="btnDeck"> <a class="dropdown-item" each="{d in this.decks}" onclick="{() => deckSelected(d)}">{d}</a> </div> </div> </div>', 'deck-add-buttons .w300,[data-is="deck-add-buttons"] .w300{ width: 300px; }', '', function(opts) {
        this.decks = null;

        this.on('mount', () => {
            deck.getDecks()
            .then((res) => {
                this.decks = res;
                this.update();
            })
            .catch(console.error);
        });

        this.deckSelected = d => {
            $(".btnDeck").html(d);
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

riot.tag2('decks-page', '<span show="{this.decks == null || this.decks.length == 0}" class="badge badge-warning">No decks found.<br>Copy decklist text files into ~/.umtg/decks<br>and reload</span> <div class="scrollable"> <deck-list decks="{this.decks}" selecteddeck="{this.selectedDeck}" callback="{onDeckClicked}"></deck-list> </div> <div class="scrollable"> <card-list></card-list> <loader></loader> </div> </div>', 'decks-page { display: grid; grid-gap: 10px; grid-template-columns: 300px 1fr; }', 'class="page"', function(opts) {
var _this = this;

/* globals deck, events */
var self = this;
this.decks = [];
this.selectedDeck = null;

this.on("mount", () => {
    _this.decks = deck.getDecks().then(_this.setDecks);
});

this.on("update", () => {
    if (_this.selectedDeck == null && _this.decks.length > 0) {
        _this.selectedDeck = _this.decks[0];
    }
});

this.setDecks = decks => {
    console.log(decks);
    _this.decks = decks;
};

this.showCardsOfDeck = d => {
    _this.tags['loader'].show();
    var cardList = _this.tags["card-list"];
    deck.getCardsOfDeck(d).then(deck => {
        // TODO: sideboard
        cardList.opts.cards = deck.cards;
        cardList.update();
        _this.tags['loader'].hide();
    });
    _this.visibleDeck = d;
};

events.on("deck:onClick", function (element) {
    self.showCardsOfDeck(element.opts.deck);
});

events.on('settingsUpdate', this.update);
});

riot.tag2('deck', '<p>{this.opts.deck}</p>', '', '', function(opts) {
});

riot.tag2('loader', '<div show="{this.loading}" class="background"><div> <div show="{this.loading}" class="loader" id="loader"></div>', 'loader .background,[data-is="loader"] .background{ position: fixed; top: 0; bottom: 0; left: 0; right: 0; background-color: #000; opacity: 0.5; z-index: 1000; } loader .loader,[data-is="loader"] .loader{ position: absolute; top: 20%; left: 50%; z-index: 99; border: 16px solid #f3f3f3; border-top: 16px solid #3498db; border-radius: 50%; width: 120px; height: 120px; animation: spin 2s linear infinite; } @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }', 'show="{this.loading}"', function(opts) {
var _this = this;

this.loading = false;

this.show = () => {
    _this.loading = true;
    _this.update();
};

this.hide = () => {
    _this.loading = false;
    _this.update();
};
});

riot.tag2('navigation', '<nav class="navbar navbar-expand-lg navbar-dark bg-dark"> <a class="navbar-brand" href="#">UMTG</a> <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation"> <span class="navbar-toggler-icon"></span> </button> <div class="collapse navbar-collapse" id="navbarNavAltMarkup"> <div class="navbar-nav"> <a id="navPage{pageKey}" class="nav-item nav-link" onclick="{onClick(pageKey)}" each="{pageKey in this.opts.pages}" href="#">{pageKey}</a> </div> </div> </nav>', 'navigation ul,[data-is="navigation"] ul{ list-style-type: none; margin: 0; padding: 0; overflow: hidden; } navigation li,[data-is="navigation"] li{ float: left; } navigation a,[data-is="navigation"] a{ display: block; text-align: center; padding: 14px 16px; text-decoration: none; color: var(--color--background); } navigation li:hover,[data-is="navigation"] li:hover{ background-color: var(--color-background); color: var(--color-font-fg); } navigation li.active:hover,[data-is="navigation"] li.active:hover{ } navigation li.active,[data-is="navigation"] li.active{ background-color: var(--color-background); background: linear-gradient(var(--color-background), darkgray); color: var(--color-font-fg); } navigation .navLogo,[data-is="navigation"] .navLogo{ font-weight: bold; }', 'class="header"', function(opts) {


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

riot.tag2('picture-buttons', '<div class="btn-group btn-group-sm"> <button id="removeButton" onclick="{removeCardFromCollection}" class="btn btn-default delete" role="group"></button> <button id="lblAmount" class="btn btn-default" role="group">?</label> <button id="addButton" onclick="{addCardToCollection}" class="btn btn-default add" role="group"><span class="glyphicon glyphicon-search"></span></button> </div>', '', '', function(opts) {
        this.decks = null;
        this.on('mount', () => {
            db.getAmountOfCard(this.opts.card.id, this.updateAmount);
            deck.getDecks()
            .then((res) => this.decks = res)
            .catch(console.error);
        });

        this.updateAmount = amount => {
            var lblAmount = this.root.querySelector("#lblAmount");
            lblAmount.innerHTML = amount;
        };

        this.addCardToCollection = () => {

            db.cardExistsById(this.opts.card.id)
            .then((exists) => {
                if (exists) {
                    db.cardAdjustAmount(this.opts.card, 1)
                    .then(this.updateAmount)
                    .catch(console.error);
                } else {
                    db.cardAdd(this.opts.card, 1);
                    this.updateAmount(1);
                }
            })
            .catch(console.error);
        };

        this.removeCardFromCollection = () => {
            db.cardExistsById(this.opts.card.id)
            .then((exists) => {
                if (exists) {
                    db.cardAdjustAmount(this.opts.card, -1)
                    .then(this.updateAmount)
                    .catch(console.error);
                } else {
                    this.updateAmount(0);
                }
            })
            .catch(console.error);
        };

});

riot.tag2('search-page', '<card-search class="leftContent" callback="{onSearchEntered}"></card-search> <div class="scrollable"> <card-list></card-list> <loader></loader> </div>', 'search-page { display: grid; grid-gap: 10px; grid-template-columns: 300px 3fr; }', 'class="page"', function(opts) {
var _this = this;

/* global riot, scry */
riot.mount("card-search");
riot.mount("card-list");
this.loading = false;

this.onSearchEntered = filter => {
    _this.tags['loader'].show();
    scry.searchByFilter(filter).then(_this.onDataAvailable).catch(_this.onDataNotAvailable);
};

this.onDataAvailable = data => {
    _this.tags["card-list"].opts.cards = data.data;
    _this.tags["card-list"].update();
    _this.tags['loader'].hide();
};

this.onDataNotAvailable = () => {
    _this.tags["card-list"].trigger("data_loaded", {});
    _this.tags['loader'].hide();
};

events.on('settingsUpdate', this.update);
});

riot.tag2('set-list', '<set code="{s.code}" if="{settings.isSetTypeVisible(s.set_type)}" onclick="{() => onSetClick(index, s)}" each="{s, index in this.opts.sets}" set="{s}"></set>', '', 'class="list-group scrollable"', function(opts) {
var _this = this;

/* global document, $ */

this.on("update", () => {
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

riot.tag2('settings-page', '<div class="container"> <div class="row"> <div class="col-sm"> <h1><span class="badge badge-secondary">Visibile Set Types</span></h1> <ul> <li each="{value, name in settings.getSetTypes()}"> <input onclick="{onSetTypeClicked()}" class="form-check-input" type="checkbox" riot-value="{name}" checked="{value}">{name}</input> </li> <ul> </div> <div class="col-sm"> <h1><span class="badge badge-secondary">Gui Settings</span></h1> <input onclick="{onShowCardImages()}" class="form-check-input" type="checkbox" checked="{settings.isGridActive()}">Show card images</input> </div> </div> </div>', '', 'class="page"', function(opts) {

this.onSetTypeClicked = () => {
    return e => {
        settings.setSetTypeVisible(e.srcElement.value, e.srcElement.checked);
    };
};

this.onShowCardImages = () => {
    return e => {
        settings.setGridActive(e.srcElement.checked);
        events.trigger('settingsUpdate');
    };
};

events.on('settingsUpdate', this.update);
});


riot.tag2('umtg-footer', '<footer class="footer"> <div class="container-flex"> <div class="row" style="margin: 5px"> <div class="col col-4"> <deck-add-buttons></deck-add-button> </div> <div class="col col-5"> </div> <div class="col col-3 text-right"> <div class="btn-group btn-group-lg btn-group-toggle" data-toggle="buttons"> <label class="{settings.isGridActive() ? \'btn btn-primary focus active\' : \'btn btn-secondary\'}" onclick="{handleViewSettingClick}"> <input type="radio" name="view" id="true" autocomplete="off"> <span class="oi oi-grid-two-up" title="icon audito" aria-hidden="false"></span></button> </label> <label class="{!settings.isGridActive() ? \'btn btn-primary focus active\' : \'btn btn-secondary\'}" onclick="{handleViewSettingClick}"> <input type="radio" name="view" id="flase" autocomplete="off"> <span class="oi oi-list" title="icon audito" aria-hidden="false"></span> </label> </div> </div> </div> </div> </footer>', '', '', function(opts) {

        this.handleViewSettingClick = (e) => {
            $(this.root).find('.btn-primary').removeClass('btn-primary').addClass('btn-secondary');
            let lbl = $(e.srcElement).closest('label')
            lbl.removeClass('btn-secondary').addClass('btn-primary');
            settings.setGridActive(lbl.find('input').attr('id') == 'true');
            events.trigger('settingsUpdate');
        }

        events.on('settingsUpdate', this.update);

});
