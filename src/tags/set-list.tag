<set-list>
    <set tabindex="0" onClick={onSetClick(s)} each={s in this.opts.sets} set={s}></set>

    <style>
        set:focus {
            background-color: black;
        }

    </style>
    <script>
        onSetClick(set) {
            var callback = this.opts.callback;
            return function(e) {
                callback(set);
            }
        }
    </script>
</set-list>
