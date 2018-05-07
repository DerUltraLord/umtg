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
            setList.querySelector('.selected').classList.remove('selected');
            getJSON(set.search_uri, this.onSet);
            setList.querySelector('set[code="' + set.code + '"]').classList.add('selected')
        }

        onSet(res) {
            this.tags['card-list'].opts.cards = res.data;
            this.tags['card-list'].update();
            console.log("hier");
        }

        onSetClicked(set) {
            this.showCardsOfSet(set);
        }

    </script>
</collection-page>
