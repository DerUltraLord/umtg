<decks-page class="fullHeight">
    <div class="box scrollable">
        <label tabindex="0" onClick={onClick(d)} each={d in this.decks}>{d.name}</label>
    </div>
    <div class="box scrollable">
        <card-list></card-list>
    </div>


    <style>
        decks-page {
            display: grid;
            grid-gap: 10px;
            grid-template-columns: 250px 1fr;
        }
    </style>
    <script>
        this.decks = []
        this.on('mount', function() {
            this.decks = deck.getDecks(this.setDecks);
        });

        setDecks(decks) {
            this.decks = decks;
        };

        onClick(d) {
            return function(e) {
                var cards = []
                var cardList = this.parent.tags['card-list'];
                deck.getCardsOfDeck(d.name, function(card) {
                    cards.push(card);
                    cardList.opts.cards = cards;
                    cardList.update();
                });
            }
        }
    </script>
</decks-page>
