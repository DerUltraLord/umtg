<picture-buttons>
    <div class="btn-group btn-group-sm">
        <button id="removeButton" onClick="{removeCardFromCollection}" class="btn btn-default delete" role="group"></button>
        <button id="lblAmount" class="btn btn-default" role="group">?</label>
        <button id="addButton" onClick="{addCardToCollection}" class="btn btn-default add" role="group"><span class="glyphicon glyphicon-search"></span></button>
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

    </script>
</picture-buttons>
