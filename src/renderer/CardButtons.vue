<template>
    <div class="btn-group btn-group-sm">
        <button id="removeButton" @click="removeCardFromCollection" class="btn btn-default delete" role="group"></button>
        <label ref="lblAmount" class="btn btn-default" role="group">{{ card.ownedAmount }}</label>
        <button id="addButton" @click="addCardToCollection" class="btn btn-default add" role="group"></button>
    </div>
</template>

<script>
import Model from '../main/model.js'
export default {
    props: ['card'],
    methods: {
        removeCardFromCollection() {
            Model.removeCardFromCollection(this.card);
        },
        addCardToCollection() {
            Model.addCardToCollection(this.card);
        }
    }

}
</script>

<style scoped>
.delete:before {
    content: "\2718";        
}
.add:before {
    content: "\271A";
}
</style>

