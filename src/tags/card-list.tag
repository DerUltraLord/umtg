<card-list>
    <div id="cardDiv" onClick={onClick(c)} each={c in this.opts.cards}>
        <h2>{c.name}</h2>
        <img width="200px"></img>
        <p>{c.oracle_text}</p>
    <div>
   
   <style>

        p {
            margin-bottom: 0px;
            padding-bottom: 1em;
        }
        div {
            margin: 0px 0px 0px 0px;
            background-color: white;
        }

        div.active {
            background-color: lightgray;
        }
   </style>
    <script>
        
        findParentNode(node, tagName) {
            while(node) {
                if (node.tagName.toUpperCase() === tagName.toUpperCase()) {
                    return node;
                }
                node = node.parentNode;
            }
            return null;
        }       

        this.state = {
            "selectedCard": null,
            "selectedElement": null
        }

        onClick(card) {
            return function(e) {

                this.selectedCard = card;
                var cardDiv = this.findParentNode(e.target, 'div');
                cardDiv.className = 'active';
                if (this.state.selectedElement != null) {
                    this.state.selectedElement.className = '';
                }
                this.state.selectedElement = cardDiv;

            
            }
        }
        

        this.on('data_loaded', function(cards) {
            opts.cards = cards;
            this.update();
        });
    </script>
</card-list>