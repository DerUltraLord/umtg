<template>
    <div class="btn-group btn-group-sm">
        <button id="removeButton" @click="$emit('removeCard')" class="btn btn-default delete" role="group"></button>
        <span class="label label-default bg-light" role="group">{{ this.amount }}</span>
        <button id="addButton" @click="$emit('addCard')" class="btn btn-default add" role="group"></button>
    </div>
</template>

<script>
import * as Model from '../store/model.ts';
export default {
    props: ['card', 'amount'],
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

