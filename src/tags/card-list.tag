<card-list class="list-group scrollable">
    <card onClick={onClick(c)} each={c in this.opts.cards} card={c}></card>
   
   <style>

        card:focus {
            background-color: var(--color-background-two);
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


                //this.selectedCard = card;
                //var cardDiv = this.findParentNode(e.target, 'card');
                //cardDiv.classList.add('active');
                //if (this.state.selectedElement != null) {
                //    this.state.selectedElement.classList.remove('active');
                //}
                //this.state.selectedElement = cardDiv;

            
            }
        }

        

        this.on('data_loaded', function(cards) {
            opts.cards = cards;
            this.update();
        });

    </script>
</card-list>
