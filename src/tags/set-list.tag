<set-list>
    <set tabindex="0" if={ this.setTypes[s.set_type] } } onClick={onSetClick(s)} each={s in this.opts.sets} set={s}></set>

    <style>
        set:focus {
            background-color: black;
        }

    </style>
    <script>

        this.setTypes = null;

        this.on('update', function() {
            console.log("set list update");
            this.setTypes = document.getElementsByTagName('settings-page')[0]._tag.settings.setTypes;
        });

        onSetClick(set) {
            var callback = this.opts.callback;
            return function(e) {
                callback(set);
            }
        }
    </script>
</set-list>
