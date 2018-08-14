<template>
    <div>
        <form @submit.prevent="handleSubmit" class="cardSearchContainer">
            <label>Name:</label>
            <input v-model="name" placeholder="Name or Scryfall search" type="text">
            <label>Type:</label>
            <input v-model="searchType" placeholder="Creature">
            <label>Text:</label>
            <input v-model="text" placeholder="Oracle Text">
            <label>Edition:</label>
            <input v-model="edition" placeholder="XLN">
            <div/>
            <button type="submit" class="btn btn-primary">Search</button>
        </form>
    </div>
</template>

<script>
import * as Model from '../main/model.ts';
export default {
    data() {
        return {
            name: '',
            searchType: '',
            text: '',
            edition: '',
        };
    },
    methods: {
        handleSubmit() {
            let filter = Model.getScryfallSearchFilter(this.$data.name, this.$data.searchType, this.$data.text, this.$data.edition);
            this.$emit('searchCard', filter);
        }
    }
};
</script>

<style>
.cardSearchContainer {
    display: grid;
    margin-top: 10px;
    margin-left: 10px;
    grid-gap: 10px;
    grid-template-columns: 60px 1fr;
}
</style>
