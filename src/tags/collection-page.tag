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

    <script>

        this.currentSet = null;

        this.on('mount', function() {
            db.getSets(this.checkIfSetsAreInDb);
        });

        checkIfSetsAreInDb(res) {
            if (res.length == 0) {
                scry.scryfallGetSets(this.onSetsFromScryfall);
            }
            this.onGetSetsFromDb(res);
        }

        onGetSetsFromDb(res) {
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
        }

        onSetsFromScryfall(res) {
            res.data.forEach(function(set) {
                db.setAdd(set);
            });
            db.getSets(this.onGetSetsFromDb);
        }


        showCardsOfSet(set) {
            var setList = this.tags['set-list'].root;
            this.currentSet = set;
            var selectedItem = setList.querySelector('.selected')
            if (selectedItem) {
                selectedItem.classList.remove('selected');
            }

            setList.querySelector('set[code="' + set.code + '"]').classList.add('selected')
            db.getCardsOfSet(set, this.onCardsFromDb);

        }

        onCardsFromDb(res) {
            if (res.length < this.currentSet.card_count) {
                getJSON(this.currentSet.search_uri, this.onCardsFromScryfall);
            } else {
                console.log("set already stored " + this.currentSet.name);
                this.showCards(res);
                console.log(res);
            }
        }

        onCardsFromScryfall(res) {
            for (var i = 0; i < res.data.length; ++i) {
                var card = res.data[i];
                db.cardAdd(card, 0);
            }

            if (res.has_more == true) {
                getJSON(res.next_page, this.onCardsFromScryfall);
            } else {
                db.getCardsOfSet(this.currentSet, this.onCardsFromDb);
            }

        }

        showCards(cards) {
            this.tags['card-list'].opts.cards = cards;
            this.tags['card-list'].update();
        }

        onSetClicked(set) {
            this.showCardsOfSet(set);
        }

    </script>
</collection-page>
