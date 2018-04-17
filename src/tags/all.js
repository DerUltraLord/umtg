riot.tag2('card-list', '<card onclick="{onClick(c)}" each="{c in this.opts.cards}" card="{c}"></card>', 'card-list .picture,[data-is="card-list"] .picture{ grid-row:1/3; } card-list .text,[data-is="card-list"] .text{ align-self:start; } card-list #cardDiv,[data-is="card-list"] #cardDiv{ display: grid; grid-template-columns: 200px 1fr; grid-template-rows: 1fr 3fr; } card-list p,[data-is="card-list"] p,card-list h2,[data-is="card-list"] h2{ margin-bottom: 0px; margin-top: 0; } card-list div,[data-is="card-list"] div{ margin: 0px 0px 0px 0px; } card-list div.active,[data-is="card-list"] div.active{ background-color: lightgray; }', '', function(opts) {

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

                this.selectedCard = card;
                var cardDiv = this.findParentNode(e.target, 'div');
                cardDiv.className = 'active';
                if (this.state.selectedElement != null) {
                    this.state.selectedElement.className = '';
                }
                this.state.selectedElement = cardDiv;

            }
        }.bind(this)

        this.on('data_loaded', function(cards) {
            opts.cards = cards;
            this.update();
        });

});
riot.tag2('card-search', '<form class="cardSearchContainer" onsubmit="{onSearch}"> <label>Name:</label> <input placeholder="Name or Scryfall search" type="text" ref="searchString"></input> <label>Type:</label> <input placeholder="Creature"></input> <label>Text:</label> <input placeholder="Oracle Text"></input> <label>Edition:</label> <input placeholder="XLN"></input> <button id="searchButton">Search</Search> </form>', '', '', function(opts) {
    this.onSearch = function(e) {
        e.preventDefault();
        this.opts.callback(this.refs.searchString.value);
    }.bind(this)
});
riot.tag2('card', '<img id="image{this.opts.card.id}" class="cardImage" width="200px"></img> <h2 id="cardName{this.opts.card.id}" class="cardName">{this.opts.card.name}</h2> <div id="cardMana{this.opts.card.id}" class="cardMana"></div> <h3 id="cardType{this.opts.card.id}" class="cardType">{this.opts.card.type_line}</h3> <p class="cardText">{this.opts.card.oracle_text}</p> <div class="cardActions"> <button>test</button> </div>', '', 'class="cardContainer"', function(opts) {

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
});

riot.tag2('collection-page', '<div class="box collectionContent1 scrollable"> <set-list sets="{this.opts.sets}"></set-list> </div> <div class="box collectionContent2 scrollable"> <card-list><card-list></div>', 'collection-page .mana,[data-is="collection-page"] .mana{ }', 'class="contentCollectionPage"', function(opts) {

    this.on('update', function() {
        scryfallGetSets(this.onSets);
    });

    this.onSets = function(res) {
        opts.sets = res.data;
        this.tags['set-list'].update();

        $.getJSON(opts.sets[0].search_uri, this.onSet);
    }.bind(this)

    this.onSet = function(res) {
        console.log("HIER");
        this.tags['card-list'].opts.cards = res.data;
        this.tags['card-list'].update();
    }.bind(this)

});

riot.tag2('navigation', '<ul> <li> <a class="navLogo" href="#">UMTG</a> <li> <li id="navPage{pageKey}" class="navElement" each="{pageKey in this.opts.pages}" id="nav{pageKey}" onclick="{parent.onClick(pageKey)}"> <a href="#">{pageKey}</a> </li> </ul>', 'navigation .navLogo,[data-is="navigation"] .navLogo{ color: lightgreen; font-weight: bold; }', 'class="header"', function(opts) {
    this.onClick = function(page) {
        return function(e) {
            this.opts.onPageSelected(page)
            var elements = document.getElementsByClassName("navElement");
            for (var i = 0; i < elements.length; ++i) {
                elements[i].classList.remove("active");
                console.log(elements[i].id == "nav"+page)
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
riot.tag2('search-page', '<card-search class="box content1" callback="{onSearchEntered}"></card-search> <card-list class="content2 scrollable" id="cardResult"></card-list> <div class="content3"><p>Content3</p></div> <div class="box footer"> <button>add</button> <button>remve</button> </div>', '', 'class="contentSearchPage"', function(opts) {
        riot.mount('card-search');
        riot.mount('card-list');

        this.onSearchEntered = function(searchText) {

            res = $.getJSON("https://api.scryfall.com/cards/search?order=cmc&q=" + searchText, this.onDataAvailable);
            res.fail(this.onDataNotAvailable);

        }.bind(this)

        this.onDataAvailable = function() {
            this.tags['card-list'].trigger('data_loaded', res.responseJSON.data);

        }.bind(this)

        this.onDataNotAvailable = function() {
            this.tags['card-list'].trigger('data_loaded', {});

        }.bind(this)

});

riot.tag2('set-list', '<set each="{s in this.opts.sets}" set="{s}"></set>', '', '', function(opts) {
});

riot.tag2('set', '<img riot-src="{this.opts.set.icon_svg_uri}" width="16px" height="16px"></img> <label>{this.opts.set.name}</label>', 'set { display: grid; grid-gap: 0px; grid-template-columns: 20px 1fr; } set img,[data-is="set"] img{ width: 16px; height: 16px; background-color: white; } set label,[data-is="set"] label{ font-size: 50%; border-bottom: 1px solid var(--color-brown); }', '', function(opts) {
});
