<template>
    <div class="row">
        <div class="row">
            <div class="col-2">
                <img class="" v-bind:src=set.icon_svg_uri></img>
            </div>
            <div class="col-10">
                <span class="badge badge-default">{{ set.name }}</span>
            </div>
        </div>
        <div class="row">
            <div class="col-2">
                <label>{{ set.code }}</label>
            </div>
            <div class="col-10">
                <div class="progress">
                    <div ref="progressBar" class="progress-bar" role="progressbar" v-bind:aria-valuenow=set.ownedCards v-bind:style="{width: (set.ownedCards / set.card_count) * 100 + '%'}"  aria-valuemin="0" aria-valuemax="100"></div> 
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Model from '../main/model.js'
export default {
    props: ['set'],
}
</script>

<style scoped>
img {
    width: 20px;
    height: 20px;
    margin-left: 5px;
}

label {
    font-size: 80%;
    margin-bottom: 0px;
    margin-left: 5px;
}
</style>
