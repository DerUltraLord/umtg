<template>
    <div class="btn-group btn-group-sm">
        <button id="removeButton" @click="removeCardFromCollection" class="btn btn-default delete" role="group"></button>
        <span class="label label-default bg-light" role="group">{{ card.ownedAmount }}</span>
        <button id="addButton" @click="addCardToCollection" class="btn btn-default add" role="group"></button>
    </div>
</template>

<script>
import * as Model from '../main/model.ts';
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

};
</script>

<style scoped>
.delete:before {
    content: "\2718";        
}
.add:before {
    content: "\271A";
}
span {
    padding-right: 10px;
    padding-left: 10px;
    padding-top: 2px;
}
</style>

