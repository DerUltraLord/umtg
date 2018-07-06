<template>
    <nav class="navbar navbar-expand-sm navbar-dark bg-dark">
        <a class="navbar-brand" href="#">{{ title }}</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="navbar-collapse" id="navbarNavAltMarkup">
            <div class="navbar-nav">
                <a v-for="page in pages" @click="$emit('pageSelected', page)" v-bind:id=page.key v-bind:class="{ active: currentPage == page.key }" class="nav-item nav-link" href="#">{{page.name}}</a>
            </div>
        </div>
    </nav>
    
</template>

<script>
export default {
    name: "Navigation",
    props: ['pages', 'currentPage'],
    data() {
        return {
            title: "UMTG",
        }
    },
}
</script>
