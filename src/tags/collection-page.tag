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


        this.on('update', function() {
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
            this.showSet(this.tags['set-list'].tags['set'][0].opts.set);
        }

        onSetsFromScryfall(res) {
            res.data.forEach(function(set) {
                db.setAdd(set);
            });
            db.getSets(this.onGetSetsFromDb);
        }


        showSet(set) {
            getJSON(set.search_uri, this.onSet);
        }

        onSet(res) {
            this.tags['card-list'].opts.cards = res.data;
            this.tags['card-list'].update();
        }

        onSetClicked(set) {
            this.showSet(set);
        }

    </script>
</collection-page>
