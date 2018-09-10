<template>
    <div>
        <v-form @submit.prevent="handleSubmit">
            <v-text-field v-model="$store.state.search.name" placeholder="Search"></v-text-field>
            <v-text-field v-model="$store.state.search.type" placeholder="Type"></v-text-field>
            <v-text-field v-model="$store.state.search.text" placeholder="Oracle Text"></v-text-field>
            <v-text-field v-model="$store.state.search.edition" placeholder="Edition"></v-text-field>
            
            <v-btn color="blue" type="submit" class="btn btn-primary">Search</v-btn>
        </v-form>
    </div>
</template>

<script>
export default {
    methods: {
        async handleSubmit() {
            this.$store.commit('search/setLoading', true);
            await this.$store.dispatch('search/doSearch');
            await this.$store.dispatch('search/filterCards');
            await this.$store.dispatch('search/sortCards');
            this.$store.commit('search/setLoading', false);
        }
    }
};
</script>

<style>

</style>
