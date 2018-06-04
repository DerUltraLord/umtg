<collection-page>
    <div class="scrollable leftContent">
        <set-list callback={onSetClicked} sets={this.opts.sets}></set-list>
    </div>
    <div class="scrollable">
        <card-list><card-list>
    </div>

    <style>
        collection-page {
            display: grid;
            grid-gap: 10px;
            grid-template-columns: 300px 1fr;
        }

    </style>

    <script type="es6">
        /* globals db, scry, getJSON */

        this.currentSet = null;

        this.on("mount", () => {
            db.getSets(this.checkIfSetsAreInDb);
        });

        this.checkIfSetsAreInDb = res => {
            if (res.length == 0) {
                scry.scryfallGetSets(this.onSetsFromScryfall);
            }
            this.onGetSetsFromDb(res);
        };

        this.onGetSetsFromDb = res => {
            var sets = [];
            for (var i = 0; i < res.length; ++i) {
                var set = JSON.parse(res[i].jsonString);
                sets.push(set);
            }
            this.opts.sets = sets;
            
            this.tags["set-list"].update();
            if (this.tags["card-list"].opts.cards == undefined) {
                var setToShow = this.tags["set-list"].tags["set"][0];
                this.showCardsOfSet(setToShow.opts.set);
                
            }
        };

        this.onSetsFromScryfall = res => {
            res.data.forEach(function(set) {
                db.setAdd(set);
            });
            db.getSets(this.onGetSetsFromDb);
        };


        this.showCardsOfSet = set => {
            this.currentSet = set;
            db.getCardsOfSet(set, this.onCardsFromDb);

        };

        this.onCardsFromDb = res => {
            // TODO: getJSON to module
            if (res.length < this.currentSet.card_count) {
                getJSON(this.currentSet.search_uri, this.onCardsFromScryfall);
            } else {
                this.showCards(res);
            }
        };

        this.onCardsFromScryfall = res => {
            for (var i = 0; i < res.data.length; ++i) {
                var card = res.data[i];
                db.cardAdd(card, 0);
            }

            if (res.has_more == true) {
                getJSON(res.next_page, this.onCardsFromScryfall);
            } else {
                db.getCardsOfSet(this.currentSet, this.onCardsFromDb);
            }

        };

        this.showCards = cards => {
            this.tags["card-list"].opts.cards = cards;
            this.tags["card-list"].update();
        };

        this.onSetClicked = set => {
            this.showCardsOfSet(set);
        };

    </script>
</collection-page>
