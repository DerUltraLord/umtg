<collection-page class="contentCollectionPage">
    <div class="box collectionContent1 scrollable">
        <set-list sets={this.opts.sets}></set-list>
    </div>
    <div class="box collectionContent2 scrollable">
        <card-list><card-list></div>

    <style>
    .mana {
      
        
    }

    </style>

    <script>

    this.on('update', function() {
        scryfallGetSets(this.onSets);
    });

    onSets(res) {
        opts.sets = res.data;
        this.tags['set-list'].update();

        $.getJSON(opts.sets[0].search_uri, this.onSet);
    }

    onSet(res) {
        console.log("HIER");
        this.tags['card-list'].opts.cards = res.data;
        this.tags['card-list'].update();
    }

    </script>
</collection-page>
