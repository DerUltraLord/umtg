
<umtg-footer>
    <footer class="footer">
        <div class="container-flex">
            <div class="row" style="margin: 5px">
                <div class="col col-4">
                    <deck-add-buttons></deck-add-button>
                </div>
                <div class="col col-5">
                </div>
                <div class="col col-3 text-right">
                    <div class="btn-group btn-group-lg btn-group-toggle" data-toggle="buttons">
                        <label class="{ settings.isGridActive() ? 'btn btn-primary focus active' : 'btn btn-secondary'}" onclick={ handleViewSettingClick }>
                            <input type="radio" name="view" id="true" autocomplete="off">
                            <span class="oi oi-grid-two-up" title="icon audito" aria-hidden="false"></span></button>
                        </label>
                        <label class="{ !settings.isGridActive() ? 'btn btn-primary focus active' : 'btn btn-secondary'}" onclick={ handleViewSettingClick }>
                            <input type="radio" name="view" id="flase" autocomplete="off">
                            <span class="oi oi-list" title="icon audito" aria-hidden="false"></span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    </footer>

    <script>

        this.handleViewSettingClick = (e) => {
            $(this.root).find('.btn-primary').removeClass('btn-primary').addClass('btn-secondary');
            let lbl = $(e.srcElement).closest('label')
            lbl.removeClass('btn-secondary').addClass('btn-primary');
            settings.setGridActive(lbl.find('input').attr('id') == 'true');
            events.trigger('settingsUpdate');
        }

        events.on('settingsUpdate', this.update);

    </script>
</umtg-footer>
