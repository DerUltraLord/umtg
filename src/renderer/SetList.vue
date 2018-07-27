<template>
    <div class="list-group scrollable">
        <Set @click.native="$emit('setClicked', set)" v-for="set in sets" v-bind:data="set" v-bind:key="set.code" :set=set v-bind:class="['list-group-item', selectedSet != null && selectedSet.code == set.code ? 'list-group-item-info' : '']"></Set>
    </div>

</template>

<script>
import Set from './Set.vue';
export default {
    props: ['sets', 'selectedSet'],
    components: {
        Set,
    },
};
</script>
