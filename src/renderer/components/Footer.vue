<template>
    <footer class="footer">
        <div class="container-flex">
            <div class="row" style="margin: 5px">
                <div class="col col-4">
                    <DeckAddButton></DeckAddButton>
                </div>
                <div class="col col-5">
                </div>
                <div class="col col-3 text-right">
                    <div class="btn-group btn-group-lg btn-group-toggle" data-toggle="buttons">
                        <label v-bind:class="[$store.state.settings.isGridActive ? 'btn btn-primary focus active' : 'btn btn-secondary']" @click="handleViewSettingClick">
                            <input type="radio" name="view" id="true" autocomplete="off">
                            <button><span class="oi oi-grid-two-up" title="icon audito" aria-hidden="false"></span></button>
                        </label>
                        <label v-bind:class="[ !$store.state.settings.isGridActive ? 'btn btn-primary focus active' : 'btn btn-secondary']" @click="handleViewSettingClick">
                            <input type="radio" name="view" id="flase" autocomplete="off">
                            <span class="oi oi-list" title="icon audito" aria-hidden="false"></span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    </footer>
</template>

<script>
import DeckAddButton from './DeckAddButton.vue';
import $ from 'jquery';
export default {
    created: function() {
    },
    methods: {
        handleViewSettingClick(e) {
            $(this.root).find('.btn-primary').removeClass('btn-primary').addClass('btn-secondary');
            let lbl = $(e.srcElement).closest('label');
            lbl.removeClass('btn-secondary').addClass('btn-primary');
            this.$store.commit('settings/setGridActive', lbl.find('input').attr('id') == 'true');
            this.$store.dispatch('settings/writeSettingsToFile');
        }
    },
    components: {
        DeckAddButton,
    }
};
</script>

<style scoped>
.footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 60px;
    background-color: black;
    z-index: 99999;
}
</style>
