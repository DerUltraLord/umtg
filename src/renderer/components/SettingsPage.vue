<template>
    <div class="container">
        <div class="row">
            <div class="col-sm">
                <h1><span class="badge badge-secondary">Visibile Set Types</span></h1>
                <ul>
                    <li v-for="(value, setType) in $store.state.settings.setTypes" v-bind:key=setType>
                        <input @click="onSetTypeClicked" class="form-check-input" type="checkbox" v-bind:value="setType" v-bind:checked="value">{{ setType }}
                    </li>
                </ul>
            </div>
            <div class="col-sm">
                <h1><span class="badge badge-secondary">Gui Settings</span></h1>
                <input @click="onShowCardImages" class="form-check-input" type="checkbox" v-bind:checked="$store.state.settings.isGridActive">Show card images
            </div>
        </div>
    </div>
</template>

<script>
export default {
    methods: {
        onSetTypeClicked(e) {
            this.$store.commit('settings/setSetVisibleStatus', {setKey: e.srcElement.value, value: e.srcElement.checked});
            this.$store.dispatch('settings/writeSettingsToFile');
        },
        onShowCardImages(e) {
            this.$store.commit('settings/setGridActive', e.srcElement.checked);
            this.$store.dispatch('settings/writeSettingsToFile');
        }
    }
};
</script>
