<collection-page>
    <div class="box collectionContent1 scrollable">
        <set-list callback={onSetClicked} sets={this.opts.sets}></set-list>
    </div>
    <div class="box collectionContent2 scrollable">
        <card-list><card-list>
    </div>

    <style>
        collection-page {
            display: grid;
            grid-gap: 10px;
            grid-template-columns: 250px 1fr;
            grid-template-areas: "collectionContent1 collectionContent2"
        }


        .collectionContent1 {
            grid-area: collectionContent1;
        }

        .collectionContent2 {
            grid-area: collectionContent2;
        }


    </style>

    <script>


        this.on('update', function() {
            scryfallGetSets(this.onSets);
        });

        onSets(res) {
            opts.sets = res.data;
            this.tags['set-list'].update();
            this.showSet(opts.sets[0]);
        }

        showSet(set) {
            $.getJSON(set.search_uri, this.onSet);
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
