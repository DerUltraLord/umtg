<template>
    <div class="container">
        <div class="row">
            <div class="col-sm">
                <h1><span class="badge badge-secondary">Visibile Set Types</span></h1>
                <ul>
                    <li v-for="(value, setType) in setTypes">
                        <input @click="onSetTypeClicked" class="form-check-input" type="checkbox" v-bind:value="setType" v-bind:checked="value">{{ setType }}</input>
                    </li>
                </ul>
            </div>
            <div class="col-sm">
                <h1><span class="badge badge-secondary">Gui Settings</span></h1>
                <input @click=onShowCardImages class="form-check-input" type="checkbox" v-bind:checked="isGridActive">Show card images</input>
            </div>
        </div>
    </div>
</template>

<script>
import Settings from '../settings.js'
export default {
    data() {
        return {
            isGridActive: false,
            setTypes: [],
        }
    },
    created: function() {
        this.setTypes = Settings.getSetTypes();
        this.isGridActive = Settings.isGridActive();
    },
    methods: {
        onSetTypeClicked(e) {
            Settings.setSetTypeVisible(e.srcElement.value, e.srcElement.checked);
        },
        onShowCardImages(e) {
            Settings.setGridActive(e.srcElement.checked);
        }
    }

}
</script>
