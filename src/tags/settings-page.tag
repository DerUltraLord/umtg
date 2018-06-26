<settings-page>
    <div class="container">
        <div class="row">
            <div class="col-sm">
                <h1><span class="badge badge-secondary">Visibile Set Types</span></h1>
                <ul>
                    <li each="{ value, name in settings.getSetTypes() }">
                        <input onClick={ onSetTypeClicked() } class="form-check-input" type="checkbox" value={ name } checked={ value }>{ name }</input>
                    </li>
                <ul>
            </div>
            <div class="col-sm">
                <h1><span class="badge badge-secondary">Gui Settings</span></h1>
                <input onClick={ onShowCardImages() } class="form-check-input" type="checkbox" checked={ settings.isGridActive() }>Show card images</input>
            </div>
        </div>
    </div>


    <script type="es6">

        this.onSetTypeClicked = () => {
            return (e) => {
                settings.setSetTypeVisible(e.srcElement.value, e.srcElement.checked);
            };
        };

        this.onShowCardImages = () => {
            return (e) => {
                settings.setGridActive(e.srcElement.checked);
            };
        };


    </script>
</settings-page>
