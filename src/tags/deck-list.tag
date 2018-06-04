<deck-list class="list-group">
    <deck id={ index } class="list-group-item" each={ d, index in this.opts.decks } deck={ d } onClick={ () => onClick(index) }></deck>
    <script type="es6">
        /* globals $, events */

        this.onClick = index => {
            let selectionClassName = "list-group-item-info";
            $("deck." + selectionClassName).removeClass(selectionClassName);
            let element = this.tags["deck"][index];
            element.root.classList.add(selectionClassName);
            events.trigger("deck:onClick", element);
        };
    </script>
</deck-list>
