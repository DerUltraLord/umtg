<template>
    <div class="container">
        <div class="row">
            <div class="col-sm">
                <h1><span class="badge badge-secondary">Visibile Set Types</span></h1>
                <ul>
                    <li v-for="(value, setType) in state.settings.setTypes">
                        <input @click="onSetTypeClicked" class="form-check-input" type="checkbox" v-bind:value="setType" v-bind:checked="value">{{ setType }}</input>
                    </li>
                </ul>
            </div>
            <div class="col-sm">
                <h1><span class="badge badge-secondary">Gui Settings</span></h1>
                <input @click=onShowCardImages class="form-check-input" type="checkbox" v-bind:checked="state.settings.isGridActive">Show card images</input>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['state'],
    methods: {
        onSetTypeClicked(e) {
            this.state.settings.setTypes[e.srcElement.value] = e.srcElement.checked;
        },
        onShowCardImages(e) {
            this.state.settings.setGridActive(e.srcElement.checked);
        }
    }

}
</script>
