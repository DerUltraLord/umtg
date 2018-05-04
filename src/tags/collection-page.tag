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
            scry.scryfallGetSets(this.onSets);
        });

        onSets(res) {
            opts.sets = res.data;
            this.tags['set-list'].update();
            // TODO: consider visible set types
            this.showSet(opts.sets[0]);
            console.log(opts.sets[0]);
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
