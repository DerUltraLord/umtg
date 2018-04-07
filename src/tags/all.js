riot.tag2('card-list', '<div id="cardDiv" onclick="{onClick(c)}" each="{c in this.opts.cards}"> <h2>{c.name}</h2> <img width="200px"></img> <p>{c.oracle_text}</p> <div>', 'card-list p,[data-is="card-list"] p{ margin-bottom: 0px; padding-bottom: 1em; } card-list div,[data-is="card-list"] div{ margin: 0px 0px 0px 0px; background-color: white; } card-list div.active,[data-is="card-list"] div.active{ background-color: lightgray; }', '', function(opts) {

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
riot.tag2('card-search', '<form onsubmit="{onSearch}"> <input type="text" ref="searchString"></input> <button id="searchButton">Search</Search> </form>', '', '', function(opts) {
    this.onSearch = function(e) {
        e.preventDefault();
        this.opts.callback(this.refs.searchString.value);
    }.bind(this)
});
riot.tag2('card', '<h1>name</h1>', '', '', function(opts) {
});
riot.tag2('collection-page', '<div class="box collectionContent1"><p> content1</p></div> <div class="box collectionContent2"><p> content2</p></div> <div class="box collectionContent3"><p> content3</p></div>', '', 'class="contentCollectionPage"', function(opts) {
});
riot.tag2('hello-form', '<form onsubmit="{sayHello}"> <input type="text" ref="greet"> <button>Say Hello</button> </form> <hello-world show="{this.greeting}" greet="{this.greeting}"></hello-world>', '', '', function(opts) {

    this.sayHello = function(e){
        e.preventDefault();
        this.greeting = this.refs.greet.value;
        this.refs.greet.value = '';
    }.bind(this)

});
riot.tag2('hello-world', '<h3>Hello {opts.greet}</h3>', '', '', function(opts) {
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
riot.tag2('search-page', '<card-search class="box content1" callback="{onSearchEntered}"></card-search> <card-list class="content2" id="cardResult"></card-list> <div class="content3"><p>Content3</p></div> <div class="box footer"> <button>add</button> <button>remve</button> </div>', '', 'class="contentSearchPage"', function(opts) {
        riot.mount('card-search');
        riot.mount('card-list');

        this.onSearchEntered = function(searchText) {

            res = $.getJSON("https://api.scryfall.com/cards/search?order=cmc&q=" + searchText, this.onDataAvailable);
            res.fail(this.onDataNotAvailable);
            console.log(res);

        }.bind(this)

        this.onDataAvailable = function() {
            this.tags['card-list'].trigger('data_loaded', res.responseJSON.data);

        }.bind(this)

        this.onDataNotAvailable = function() {
            this.tags['card-list'].trigger('data_loaded', {});

        }.bind(this)

});