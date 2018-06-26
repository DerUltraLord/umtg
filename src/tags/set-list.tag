<set-list class="list-group scrollable">
    <set code={ s.code }  if={ settings.isSetTypeVisible(s.set_type) } } onClick={ () => onSetClick(index, s) } each={s, index in this.opts.sets} set={s}></set>

    <style>
    </style>
    <script type="es6">
        /* global document, $ */

        this.on("update", () => {
            var sets = $(this.root).children();
            if (sets.length > 0) {
                if (sets.filter(".list-group-item-info").length == 0) {
                    $(sets[0]).toggleClass("list-group-item-info");
                }
            }
        });

        this.onSetClick = (index, set) => {
            let selectionClassName = "list-group-item-info";
            let tagSet = this.tags["set"][index];
            $("set." + selectionClassName).removeClass(selectionClassName);
            tagSet.root.classList.add(selectionClassName);
            this.opts.callback(set);
        };

    </script>
</set-list>
