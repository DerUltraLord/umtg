<set-list class="list-group scrollable">
    <set code={ s.code }  if={ this.setTypes[s.set_type] } } onClick={onSetClick(s)} each={s in this.opts.sets} set={s}></set>

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

        onSetClick(set) {
            var callback = this.opts.callback;
            var sets = this.root.querySelectorAll('set');
            return function(e) {
                sets.forEach(function(setElement) {
                    setElement.classList.remove('list-group-item-info');
                });
                $(e.srcElement).closest('set').toggleClass('list-group-item-info');
                callback(set);
            }
        }
    </script>
</set-list>
