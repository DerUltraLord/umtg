<card-list class="{ settings.isGridActive() ? 'd-flex flex-row flex-wrap' : 'list-group-item' }">
    <card each={c in this.opts.cards} card={c} grid={ settings.isGridActive() }></card>
   
   <style>

        card:focus {
            background-color: var(--color-background-two);
        }

   </style>
    <script type="es6">

        this.state = {
            "selectedCard": null,
            "selectedElement": null
        };


        this.on("data_loaded", function(cards) {
            this.opts.cards = cards;
            this.update();
        });

    </script>
</card-list>
