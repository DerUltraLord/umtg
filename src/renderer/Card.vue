<template>
    <div>
        <div v-if="!isGridActive" class="media">
            <div class="m20">
                <img v-bind:src="card.image_uris.art_crop" width="250" height="200"></img>
                <div>
                </div>
            </div>
            <div class="media-body">
                <div class="row">
                    <h2 class="col-lg-8">{{ card.name }}</h2>
                    <div class="col-lg-4"></div>
                </div>
                <h3 class="cardType">{{ card.type_line }}</h3>
                <p class="cardText">{{ card.oracle_text }}</p>
            </div>
        </div>

        <div v-else>
            <div class="container">
                <div class="row">
                    <div class="col">
                        <img v-bind:src="card.image_uris ? card.image_uris.normal : ''" width="250"></img>
                    </div>
                </div>
                <div class="row mt10">
                    <div class="col">
                        <CardButtons :card=card></CardButtons>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import CardButtons from './CardButtons.vue'
export default {
    props: ['card', 'isGridActive'],
    components: {
        CardButtons,
    }
}
</script>
