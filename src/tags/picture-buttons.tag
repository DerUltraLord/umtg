<picture-buttons>
    <div class="btn-group btn-group-sm">
        <button id="removeButton" onClick="{removeCardFromCollection}" class="btn btn-default delete" role="group"></button>
        <button id="lblAmount" class="btn btn-default" role="group">?</label>
        <button id="addButton" onClick="{addCardToCollection}" class="btn btn-default add" role="group"><span class="glyphicon glyphicon-search"></span></button>
    </div>
    <div class="btn-group btn-group-sm float-lg-right" role="group">
        <button type="button" id="btnAddToDeck" onClick={ addCardToDeck } class="btn btn-default plus"></button>
        <div class="btn-group btn-group-sm" role="group">
            <button type="button" class="textOverflowHidden btn btn-default dropdown-toggle btnDeck" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">choose deck</button>
            <div class="dropdown-menu" aria-labelledby="btnDeck">
                <a class="dropdown-item" each={ d in this.decks } onClick={ () => deckSelected(d) }>{ d }</a>
            </div>
        </div>
    </div>

    <style>
    </style>

    <script>
        this.decks = null;
        this.on('mount', () => {
            db.getAmountOfCard(this.opts.card.id, this.updateAmount);
            deck.getDecks()
            .then((res) => this.decks = res)
            .catch(console.error);
        });

        this.updateAmount = amount => {
            var lblAmount = this.root.querySelector("#lblAmount");
            lblAmount.innerHTML = amount;
        };

        this.deckSelected = d => {
            $(".btnDeck").html(d);
        };
    </script>
</picture-buttons>
