<card>
    <img id="image{this.opts.card.id}" class="cardImage" width="200px"></img>
    <h2 id="cardName{this.opts.card.id}" class="cardName">{this.opts.card.name}</h2>
    <div id="cardMana{this.opts.card.id}" class="cardMana"></div>
    <h3 id="cardType{this.opts.card.id}" class="cardType">{this.opts.card.type_line}</h3>
    <p class="cardText">{this.opts.card.oracle_text}</p>
    <div class="cardActions">
        <button id="removeButton" onClick="{removeCardFromCollection}" class="cardButton">-</button>
        <label id="lblAmount">0</label>
        <button id="addButton" onClick="{addCardToCollection}" class="cardButton">+</button>
    </div>

    <style>
        card {
            display: grid;
            grid-gap: 10px;
            
            grid-template-columns: 200px 1fr 100px;
            grid-template-rows: 20px 20px 1fr 40px;
            grid-template-areas:    "cardImage cardName cardMana"
                                    "cardImage cardType cardType"
                                    "cardImage cardText cardText"
                                    "cardImage cardActions cardActions";
            border-bottom: 2px solid #3c3836;
            margin-top: 10px;
            margin-bottom: 10px;
        }

        .cardButton {
            color: green;
            padding-top: 0px;
            padding-bottom: 0px;
            padding-left: 5px;
            padding-right: 5px;
            border: 2px solid green;
        }

        .cardImage {
            grid-area: cardImage;
            background-color: white;
        }

        .cardName {
            grid-area: cardName;
        }

        .cardType {
            grid-area: cardType;
        }

        .cardText {
            grid-area: cardText;

        }

        .cardActions {
            grid-area: cardActions;
        }

        .cardMana {
            grid-area: cardMana;
            text-align: right;
            margin-right: 10px;
            margin-top: 3px;
        }
    </style>
    <script>

        getTagsForMana(card) {

            var re = /\{\w\}/g;
            
            res = '';
           
            while (m = re.exec(card.mana_cost)) {
                var manaString = m[0].substring(1, m[0].length -1);
                manaString = `<svg class="icon24" viewBox="0 0 600 600">
                    <use xlink:href="res/svg.svg#` + manaString + `"></use>
                    </svg>`

                res += manaString;
            }
            return res;
        };

        this.on('mount', function() {
            var cardImage = document.getElementById("image" + this.opts.card.id);
            if (this.opts.card.image_uris) {
                cardImage.setAttribute('src', this.opts.card.image_uris.art_crop);
            }

            var cardName = document.getElementById("cardMana" + this.opts.card.id);
            cardName.insertAdjacentHTML('beforeend', this.getTagsForMana(this.opts.card));


            this.update();
        });

        this.on("update", function() {
            DB.getAmountOfCard(this.opts.card.id, this.updateAmount);
        });

        updateAmount(amount) {
            var lblAmount = this.root.querySelector("#lblAmount");
            lblAmount.innerHTML = amount;
        }

        addCardToCollection() {
            DB.cardAdjustAmount(this.opts.card, 1, this.update);
        }

        removeCardFromCollection() {
            DB.cardAdjustAmount(this.opts.card, -1, this.update);
        }
    </script>

</card>
