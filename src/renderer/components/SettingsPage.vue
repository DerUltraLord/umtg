<template>
    <div class="pageWithSidebar">
        <div>
            <b-nav vertical pills>
                <b-nav-item :active="activeItem === menuItem.key" @click="activeItem = menuItem.key" v-for="menuItem in this.$data.menuItems" :key=menuItem.key>{{ menuItem.name }}</b-nav-item>
            </b-nav>
        </div>

        <div class="scrollable mt-2">
            <div v-if="$data.activeItem === 'general'">
                <b-form-checkbox  v-model="$store.state.settings.isGridActive">Show card images</b-form-checkbox>
            </div>
            <div v-if="$data.activeItem === 'visibleSetTypes'">
                <b-form-group>
                    <b-form-checkbox-group v-model=$store.state.settings.setTypes.selected stacked>
                        <b-form-checkbox @click.native=onSetTypeClicked v-for="setType in $store.state.settings.setTypes.available" :key=setType :value=setType >{{ setType }} </b-form-checkbox>
                    </b-form-checkbox-group>
                </b-form-group>
            </div>
            <div v-if="$data.activeItem === 'infoPopupContent'">
                <b-form @submit=onAddInfoPopupContent inline>
                    <label>Display Name:</label>
                    <b-form-input class="ml-2" placeholder="Mana cost" v-model="infoPopupAddForm.displayName"></b-form-input>
                    <label class="ml-5">Scryfall Property:</label>
                    <b-form-input class="ml-2" placeholder="cmc" v-model="infoPopupAddForm.property"></b-form-input>   
                    <b-button type="submit" class="ml-5" variant="success">Add</b-button>
                </b-form>
                <b-table class="mt-2" :items=this.$store.state.settings.infoPopupContent></b-table>
            </div>

        </div>
    </div>

</template> 

<script>
export default {
    data: function() {
        return {
            menuItems: [
                {name: 'General', key: 'general'},
                {name: 'Visible Set Types', key: 'visibleSetTypes'},
                {name: 'Info Popup Content', key: 'infoPopupContent'}
            ],
            activeItem: 'general',
            infoPopupAddForm: {
                displayName: '',
                property: '',
            }
        }
    },
    methods: {
        onSetTypeClicked(e) {
            this.$store.dispatch('settings/writeSettingsToFile');
            this.$store.dispatch('collection/updateSets');
        },
        onShowCardImages(e) {
            this.$store.dispatch('settings/writeSettingsToFile');
        },
        onAddInfoPopupContent(e) {
            alert("Hier");
            this.$store.commit('settings/addInfoPopupContent', this.$data.infoPopupAddForm)
            this.$store.dispatch('settings/writeSettingsToFile');
            e.preventDefault();
        }
    }
};
</script>
