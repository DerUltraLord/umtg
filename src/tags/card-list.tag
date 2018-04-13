<card-list>
    <card onClick={onClick(c)} each={c in this.opts.cards} card={c}></card>
   
   <style>

        .picture {
            grid-row:1/3;
        }

        .text {
            align-self:start;
        }

        #cardDiv {
            display: grid;
            grid-template-columns: 200px 1fr;
            grid-template-rows: 1fr 3fr;
            
        }

        p, h2 {
            margin-bottom: 0px;
            margin-top: 0;
        }
        div {
            margin: 0px 0px 0px 0px;
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