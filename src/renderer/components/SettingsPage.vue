<template>
    <div class="pageWithSidebar">
        <v-navigation-drawer v-model="drawer">
        <v-list>
          
            <template v-for="(item, index) in menuItems">
            <v-list-tile :to="{name: item.href}" :key="index" v-model="foo" active-class="active" class="active">
                <!-- <v-list-tile-action>
                    <v-icon>home</v-icon>
                </v-list-tile-action> -->
                <v-list-tile-content>
                    <v-list-tile-title>
                      
                        {{ item.name }}</v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile>
           
            </template>
        </v-list>
        </v-navigation-drawer>
     
        <!-- <div>
            <b-nav vertical pills>
                <b-nav-item :active="activeItem === menuItem.key" @click="activeItem = menuItem.key" v-for="menuItem in this.$data.menuItems" :key=menuItem.key>{{ menuItem.name }}</b-nav-item>
            </b-nav>
        </div> -->

        <div class="scrollable mt-2">
            <div v-if="$data.activeItem === 'general'">
                <v-switch  v-model="$store.state.settings.isGridActive" label="Show card images"></v-switch>
            </div>
            <div v-if="$data.activeItem === 'visibleSetTypes'">
                <v-container fluid>
                    <v-switch v-model=$store.state.settings.setTypes.selected  :value=setType :label=setType @click.native=onSetTypeClicked v-for="setType in $store.state.settings.setTypes.available" :key=setType></v-switch>
                </v-container>
            </div>
            <div v-if="$data.activeItem === 'infoPopupContent'">
               
                <v-data-table :headers="tableHeaders" :items=this.$store.state.settings.infoPopupContent hide-actions class="elevation-1">
                    <template slot="items" slot-scope="props">
            
                        <td>{{ props.item.displayName }}</td>
                        <td>{{ props.item.property }}</td>
                        <td class="justify-center layout px-0">
                        <v-icon small class="mr-2" @click="openTableDialog(props.item)" > edit </v-icon>
                        <v-icon small @click="deleteTableItem(props.item)" > delete </v-icon>
                        </td>
                    </template>
                </v-data-table>
                
                <v-dialog v-model="tableDialog" width="500">
                    <v-card>
                        <v-card-title>Change entry</v-card-title>
                        <v-card-text>
                            <v-text-field v-model=editItem.displayName></v-text-field>
                            <v-text-field v-model=editItem.property></v-text-field>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue" @click.native="$data.tableDialog = false">Cancel</v-btn>
                            <v-btn color="blue" @click.native="saveChanges">Save</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>


                 <v-form @submit=onAddInfoPopupContent inline>
                    <v-text-field class="ml-2" label="Display Name" v-model="infoPopupAddForm.displayName"></v-text-field>
                    <v-text-field class="ml-2" label="Scryfall Property" v-model="infoPopupAddForm.property"></v-text-field>   
                    <v-btn type="submit" class="ml-5" color="success">Add</v-btn>
                </v-form>
            </div>

        </div>
    </div>

</template> 

<script>
export default {
    data: function() {
        return {
            foo: null,
            drawer: true,
            menuItems: [
                {name: 'General', key: 'general'},
                {name: 'Visible Set Types', key: 'visibleSetTypes'},
                {name: 'Info Popup Content', key: 'infoPopupContent'}
            ],
            activeItem: 'general',
            tableDialog: false,
            editItem: {
                displayName: '',
                property: '',
            },
            tableHeaders: [
                {
                    text: "Display Name",
                    value: "displayName",
                    align: 'left',
                    sortable: false,
                    width: "100",
                },
                {
                    text: "Scryfall property",
                    value: "propery",
                    align: 'left',
                    sortable: false,
                    width: "100",
                },
                {
                    text: "",
                    value: "action",
                    align: 'left',
                    sortable: false,
                    width: "20",
                }
            ],
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
            this.infoPopupAddForm.displayName = '';
            this.infoPopupAddForm.property = '';
            this.$store.dispatch('settings/writeSettingsToFile');
            e.preventDefault();
        },
        openTableDialog(item) {
            this.$data.editIndex = this.menuItems.indexOf(item);
            this.$data.editItem = item;
            this.$data.tableDialog = true;
        },
        deleteTableItem(item) {
            this.editIndex = this.$store.state.settings.infoPopupContent.indexOf(item);
            if (this.editIndex >= 0) {
                this.$store.commit('settings/removeInfoPopupContent', item.displayName);
                this.$store.dispatch('settings/writeSettingsToFile');
            }
        },
        saveChanges() {
            this.$store.commit('settings/changeInfoPopupContentByIndex', {index: this.editIndex, newValue: this.editItem});
            this.$store.dispatch('settings/writeSettingsToFile');
            this.tableDialog = false;
        }
    }
};
</script>
