<set-list class="list-group scrollable">
    <set code={ s.code }  if={ this.setTypes[s.set_type] } } onClick={ () => onSetClick(index, s) } each={s, index in this.opts.sets} set={s}></set>

    <style>
    </style>
    <script>

        this.setTypes = null;

        this.on('update', function() {
            this.setTypes = document.getElementsByTagName('settings-page')[0]._tag.settings.setTypes;

            var sets = $(this.root).children();
            if (sets.length > 0) {
                if (sets.filter('.list-group-item-info').length == 0) {
                    $(sets[0]).toggleClass('list-group-item-info');
                }
            }
        });

        onSetClick(index, set) {
            let selectionClassName = 'list-group-item-info';
            let tagSet = this.tags['set'][index];
            $('set.' + selectionClassName).removeClass(selectionClassName);
            tagSet.root.classList.add(selectionClassName);
            this.opts.callback(set);
        }
    </script>
</set-list>
