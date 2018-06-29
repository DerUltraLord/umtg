<deck-add-buttons>
    <div class="btn-group btn-group-lg float-lg-left" role="group">
        <button type="button" id="btnAddToDeck" onClick={ addCardToDeck } class="btn btn-default">+</button>
        <div class="btn-group btn-group-sm dropup" role="group">
            <button type="button" class="textOverflowHidden btn btn-default dropdown-toggle btnDeck w300 text-left" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">choose deck</button>
            <div class="dropdown-menu" aria-labelledby="btnDeck">
                <a class="dropdown-item" each={ d in this.decks } onClick={ () => deckSelected(d) }>{ d }</a>
            </div>
        </div>
    </div>

    <style>
    .w300 {
        width: 300px;
    }
    </style>

    <script>
        this.decks = null;

        this.on('mount', () => {
            deck.getDecks()
            .then((res) => {
                this.decks = res;
                this.update();
            })
            .catch(console.error);
        });

        this.deckSelected = d => {
            $(".btnDeck").html(d);
        };
    </script>

</deck-add-buttons>
