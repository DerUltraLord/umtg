<card class="cardContainer">
    <img id="image{this.opts.card.id}" class="cardImage" width="200px"></img>
    <h2 id="cardName{this.opts.card.id}" class="cardName">{this.opts.card.name}</h2>
    <div id="cardMana{this.opts.card.id}" class="cardMana"></div>
    <h3 id="cardType{this.opts.card.id}" class="cardType">{this.opts.card.type_line}</h3>
    <p class="cardText">{this.opts.card.oracle_text}</p>
    <div class="cardActions">
        <button>test</button>
    </div>
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
    </script>

</card>
