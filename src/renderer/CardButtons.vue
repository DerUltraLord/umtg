<template>
    <div class="btn-group btn-group-sm">
        <button id="removeButton" @click="removeCardFromCollection" class="btn btn-default delete" role="group"></button>
        <label ref="lblAmount" class="btn btn-default" role="group">?</label>
        <button id="addButton" @click="addCardToCollection" class="btn btn-default add" role="group"></button>
    </div>
</template>

<script>
import Db from '../db.js'
export default {
    props: ['card'],
    created: function() {
        Db.getAmountOfCard(this.card, this.updateAmount);
    },
    methods: {
        updateAmount(amount) {
            this.$refs.lblAmount.innerHTML = amount;
        },
        removeCardFromCollection() {
            Db.cardExistsById(this.card.id)
            .then((exists) => {
                if (exists) {
                    Db.cardAdjustAmount(this.card, -1)
                    .then(this.updateAmount)
                    .catch(console.error);
                } else {
                    this.updateAmount(0);
                }
            })
            .catch(console.error);
        },
        addCardToCollection() {
            Db.cardExistsById(this.card.id)
            .then((exists) => {
                if (exists) {
                    Db.cardAdjustAmount(this.card, 1)
                    .then(this.updateAmount)
                    .catch(console.error);
                } else {
                    Db.cardAdd(this.card, 1);
                    this.updateAmount(1);
                }
            })
            .catch(console.error);
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

