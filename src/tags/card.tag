<card class="list-group-item">
    <div class="media">
        <div class="m20">
            <img id="image{this.opts.card.id}" width="250" height="200"></img>
            <div>
                <div>
                    <div class="btn-group btn-group-sm">
                        <button id="removeButton" onClick="{removeCardFromCollection}" class="btn btn-default delete" role="group"></button>
                        <button id="lblAmount" class="btn btn-default" role="group">?</label>
                        <button id="addButton" onClick="{addCardToCollection}" class="btn btn-default add" role="group"><span class="glyphicon glyphicon-search"></span></button>
                    </div>
                    <div class="btn-group btn-group-sm float-lg-right" role="group">
                        <button type="button" id="btnAddToDeck" onClick={ addCardToDeck } class="btn btn-default plus"></button>
                        <div class="btn-group btn-group-sm" role="group">
                            <button type="button" class="btn btn-default dropdown-toggle btnDeck" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">choose deck</button>
                            <div class="dropdown-menu" aria-labelledby="btnDeck">
                                <a class="dropdown-item" each={ d in this.availableDecks } onClick={ () => deckSelected(d) }>{ d }</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="media-body">
            <div class="row">
                <h2 id="cardName{this.opts.card.id}" class="col-lg-8">{this.opts.card.name}</h2>
                <div id="cardMana{this.opts.card.id}" class="col-lg-4"></div>
            </div>
            <h3 id="cardType{this.opts.card.id}" class="cardType">{this.opts.card.type_line}</h3>
            <p class="cardText">{this.opts.card.oracle_text}</p>
        </div>
    <div>


    <style>


        h2 {
            overflow: hidden;
            font-size: 100%;
            font-weight: bold;
        }

        h3 {
            font-size: 90%;
        }

        .m20 {
            margin-right: 20px;
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

        .cardMana {
            grid-area: cardMana;
            text-align: right;
            margin-right: 10px;
            margin-top: 3px;
        }

        .btnDeck {
            width: 120px;
        }
    </style>
    <script type="es6">
        /* global document, db, alert, $ */
        this.availableDecks = ["one", "two"];
        // TODO: move logic extra module (testable)

        this.getTagsForMana = card => {

            let re = /\{\w\}/g;
            
            let res = "";
           
            let m;
            m = re.exec(card.mana_cost);
            while (m != null) {
                let manaString = m[0].substring(1, m[0].length -1);
                manaString = `<svg class="icon24 float-lg-right" viewBox="0 0 600 600">
                    <use xlink:href="res/svg.svg#` + manaString + `"></use>
                    </svg>`;

                res = manaString + res;
                m = re.exec(card.mana_cost);
            }
            return res;
        };

        this.on("mount", function() {
            //var cardImage = document.getElementById("image" + this.opts.card.id);
            //if (this.opts.card.image_uris) {
            //    cardImage.setAttribute("src", this.opts.card.image_uris.art_crop);
            //}

            var cardName = document.getElementById("cardMana" + this.opts.card.id);
            cardName.insertAdjacentHTML("beforeend", this.getTagsForMana(this.opts.card));

            var colorIdentity = this.opts.card.color_identity;

            if (colorIdentity.length == 1) {
                var typeToAdd = "";
                if (colorIdentity[0] === "W") {
                    typeToAdd = "warning";
                } else if (colorIdentity[0] === "U") {
                    typeToAdd = "info";
                } else if (colorIdentity[0] === "B") {
                    typeToAdd = "dark";
                } else if (colorIdentity[0] === "G") {
                    typeToAdd = "success";
                } else if (colorIdentity[0] === "R") {
                    typeToAdd = "danger";
                }
                this.root.classList.add("list-group-item-" + typeToAdd);

                var buttons = this.root.querySelectorAll("button");
                buttons.forEach(function(button) {
                    button.classList.remove("btn-default");
                    button.classList.add("btn-" + typeToAdd);
                });
            }

            //this.root.querySelector("#addButton").insertAdjacentHTML("beforeend", octicons.calendar.toSVG());



            this.update();
        });

        this.on("update", function() {
            if (this.opts.card.image_uris) {
                this.root.querySelector("img").setAttribute("src", this.opts.card.image_uris.art_crop);
            }
            db.getAmountOfCard(this.opts.card.id, this.updateAmount);
        });

        this.updateAmount = amount => {
            var lblAmount = this.root.querySelector("#lblAmount");
            lblAmount.innerHTML = amount;
        };

        this.addCardToCollection = () => {
            db.cardAdjustAmount(this.opts.card, 1, this.update);
        };

        this.removeCardFromCollection = () => {
            db.cardAdjustAmount(this.opts.card, -1, this.update);
        };

        this.addCardToDeck = () => {
            alert(this.opts.card);
        };

        this.deckSelected = d => {
            $(".btnDeck").html(d);
        };
    </script>

</card>
