<collection-page>
    <div class="scrollable leftContent">
        <set-list callback={showCardsOfSet} sets={this.opts.sets}></set-list>
    </div>
    <div class="scrollable">
        <card-list><card-list>
    </div>
    <loader></loader>

    <style>
        collection-page {
            display: grid;
            grid-gap: 10px;
            grid-template-columns: 300px 1fr;
        }

    </style>

    <script type="es6">
        /* globals db, scry */

        this.currentSet = null;

        this.on("mount", () => {
            db.getSets()
            .then((sets) => {
                if (sets.length == 0) {
                    scry.scryfallGetSets()
                    .then(this.onSetsFromScryfall);
                } else {
                    this.onGetSetsFromDb(sets);
                }
            });
        });

        this.onGetSetsFromDb = res => {
            this.opts.sets = res;
            this.tags["set-list"].update();
            if (this.tags["card-list"].opts.cards == undefined) {
                var setToShow = this.tags["set-list"].tags["set"][0];
                this.showCardsOfSet(setToShow.opts.set);
                
            }
        };

        this.onSetsFromScryfall = res => {
            res.data.forEach((set) => {
                db.setAdd(set);
            });
            db.getSets()
            .then(this.onGetSetsFromDb);
        };


        this.showCardsOfSet = set => {
            this.currentSet = set;
            db.getCardsOfSet(set)
            .then(this.onCardsFromDb);

        };

        this.onCardsFromDb = res => {
            if (res.length < this.currentSet.card_count) {
                this.tags['loader'].show();
                base.getJSON(this.currentSet.search_uri)
                .then(this.onCardsFromScryfall);
            } else {
                this.showCards(res);
                this.tags['loader'].hide();
            }
        };

        this.onCardsFromScryfall = res => {
            for (var i = 0; i < res.data.length; ++i) {
                var card = res.data[i];
                db.cardAdd(card, 0);
            }

            if (res.has_more == true) {
                base.getJSON(res.next_page)
                .then(this.onCardsFromScryfall);
            } else {
                db.getCardsOfSet(this.currentSet)
                .then(this.onCardsFromDb);
            }


        };

        this.showCards = cards => {
            this.tags["card-list"].opts.cards = cards;
            this.tags["card-list"].update();
        };


    </script>
</collection-page>
