<template>
    <div>
        <form @submit.prevent="handleSubmit" class="cardSearchContainer">
            <label>Name:</label>
            <input v-model="$store.state.search.name" placeholder="Name or Scryfall search" type="text">
            <label>Type:</label>
            <input v-model=$store.state.search.type placeholder="Creature">
            <label>Text:</label>
            <input v-model="$store.state.search.text" placeholder="Oracle Text">
            <label>Edition:</label>
            <input v-model="$store.state.search.edition" placeholder="XLN">
            <div/>
            <button type="submit" class="btn btn-primary">Search</button>
        </form>
    </div>
</template>

<script>
export default {
    methods: {
        async handleSubmit() {
            await this.$store.dispatch('search/doSearch');
            await this.$store.dispatch('search/filterCards');
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
