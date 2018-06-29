<decks-page class="page">
        <span show={ this.decks == null || this.decks.length == 0 } class="badge badge-warning">No decks found.<br>Copy decklist text files into ~/.umtg/decks<br>and reload</span>
    
        <div class="scrollable">
            <deck-list decks={ this.decks } selectedDeck={ this.selectedDeck } callback={ onDeckClicked }></deck-list>
        </div>
        <div class="scrollable">
            <card-list></card-list>
            <loader></loader>
        </div>
    </div>


    <style>
        decks-page {
            display: grid;
            grid-gap: 10px;
            grid-template-columns: 300px 1fr;
        }
    </style>
    <script type="es6">
        /* globals deck, events */
        var self = this;
        this.decks = [];
        this.selectedDeck = null;

        this.on("mount", () => {
            this.decks = deck.getDecks()
            .then(this.setDecks);
        });

        this.on("update", () => {
            if (this.selectedDeck == null && this.decks.length > 0) {
                this.selectedDeck = this.decks[0];
            }
        });

        this.setDecks = decks => {
            console.log(decks);
            this.decks = decks;
        };

        this.showCardsOfDeck = d => {
            this.tags['loader'].show();
            var cardList = this.tags["card-list"];
            deck.getCardsOfDeck(d)
            .then((deck) => {
                // TODO: sideboard
                cardList.opts.cards = deck.cards;
                cardList.update();
                this.tags['loader'].hide();
            });
            this.visibleDeck = d;
        };

        events.on("deck:onClick", function(element) {
            self.showCardsOfDeck(element.opts.deck);
        });

        events.on('settingsUpdate', this.update);
    </script>
</decks-page>
