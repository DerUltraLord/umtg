<card>
    <img id="image{this.opts.card.id}" class="cardImage" width="200px"></img>
    <h2 id="cardName{this.opts.card.id}" class="cardName">{this.opts.card.name}</h2>
    <div id="cardMana{this.opts.card.id}" class="cardMana"></div>
    <h3 id="cardType{this.opts.card.id}" class="cardType">{this.opts.card.type_line}</h3>
    <p class="cardText">{this.opts.card.oracle_text}</p>
    <div class="cardActions">
        <div class="btn-group btn-group-sm">
            <button id="removeButton" onClick="{removeCardFromCollection}" class="btn btn-default delete" role="group"></button>
            <button id="lblAmount" class="btn btn-default" role="group">?</label>
            <button id="addButton" onClick="{addCardToCollection}" class="btn btn-default add" role="group"></button>
        </div>

        <div class="btn-group btn-group-sm" role="group">
            <button type="button" id="btnAddToDeck" onClick="{addCardToDeck}" class="btn btn-default plus"></button>
            <div class="btn-group btn-group-sm" role="group">
                <button id="btnDeck" type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    MyDeck
                </button>
                <div class="dropdown-menu" aria-labelledby="btnDeck">
                    <a class="dropdown-item" href="#">foo</a>
                    <a class="dropdown-item" href="#">foo</a>
                </div>
            </div>
        <div>
    </div>

    <style>
        card {
            display: grid;
            grid-gap: 10px;
            
            grid-template-columns: 200px 1fr 100px;
            grid-template-rows: 27px 20px 1fr 40px;
            grid-template-areas:    "cardImage cardName cardMana"
                                    "cardImage cardType cardType"
                                    "cardImage cardText cardText"
                                    "cardImage cardActions cardActions";
            border-bottom: 2px solid #3c3836;
            margin-top: 10px;
            margin-bottom: 10px;
        }

        h2 {
            overflow: hidden;
        }

        h3 {

        }


        .cardButton {
            display: inline-block;
            background: #ccc;
            vertical-align: middle;
            border: 1px solid #777;
            padding: 0px 0px 0px 0px;
            margin: 0px 0px 0px 0px;
            min-height: 22px;
            min-width: 20px;

        }

        .radius-right {
            border-radius: 0px 5px 5px 0px;
        }

        .radius-left {
            border-radius: 5px 0px 0px 5px;
        }

        .plus:before {
            content: "\002B";
        }

        .add:before {
            content: "\25B6";
        }


        .delete:before {
            content: "\25C0";        
        }

        .cardImage {
            grid-area: cardImage;
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
        var db = require("./src/db.js");

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
            //var cardImage = document.getElementById("image" + this.opts.card.id);
            //if (this.opts.card.image_uris) {
            //    cardImage.setAttribute('src', this.opts.card.image_uris.art_crop);
            //}

            var cardName = document.getElementById("cardMana" + this.opts.card.id);
            cardName.insertAdjacentHTML('beforeend', this.getTagsForMana(this.opts.card));


            this.update();
        });

        this.on("update", function() {
            if (this.opts.card.image_uris) {
                this.root.querySelector('img').setAttribute('src', this.opts.card.image_uris.art_crop);
            }
            db.getAmountOfCard(this.opts.card.id, this.updateAmount);
        });

        updateAmount(amount) {
            var lblAmount = this.root.querySelector("#lblAmount");
            lblAmount.innerHTML = amount;
        }

        addCardToCollection() {
            db.cardAdjustAmount(this.opts.card, 1, this.update);
        }

        removeCardFromCollection() {
            db.cardAdjustAmount(this.opts.card, -1, this.update);
        }
    </script>

</card>
