<template>
    <nav class="navbar navbar-expand-sm navbar-dark bg-dark">
        <a class="navbar-brand" href="#">{{ title }}</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="navbar-collapse" id="navbarNavAltMarkup">
            <div class="navbar-nav">
            <a v-for="(page, pageName) in pages" @click="$emit('pageSelected', pageName)" v-bind:key=pageName v-bind:data=page v-bind:class="{ active: currentPage == page.key }" class="nav-item nav-link" href="#">{{page.name}}</a>
            </div>
        </div>
        <form class="form-inline">
            <div class="btn-group">
			
                <label class="btn btn-warning active">
                    <input @change="doFilter" type="checkbox" autocomplete="off" value="W" v-model="filterColors">W
                </label>

                <label class="btn btn-info">
                    <input @change="doFilter" type="checkbox" autocomplete="off" value="U" v-model="filterColors">U
                </label>			
            
                <label class="btn btn-dark">
                    <input @change="doFilter" type="checkbox" autocomplete="off" value="B" v-model="filterColors">B
                </label>			
            
                <label class="btn btn-danger">
                    <input @change="doFilter" type="checkbox" autocomplete="off" value="R" v-model="filterColors">R
                </label>			

                <label class="btn btn-success">
                    <input @change="doFilter" type="checkbox" autocomplete="off" value="G" v-model="filterColors">G
                </label>			
		    </div>
            <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search">
        </form>
    </nav>

</template>

<script>
export default {
    name: 'Navigation',
    props: ['pages', 'currentPage'],
    data() {
        return {
            title: 'UMTG',
        };
    },
    methods: {
        doFilter() {
            let currentPage = this.$store.state.umtg.currentPage;
            if (["search", "collection", "deck"].includes(currentPage)) {
                this.$store.dispatch(currentPage + "/filterCards");
            }
        }
    },
    computed: {
        filterColors: {
            get() { return this.$store.state.umtg.filterColors },
            set(value) { this.$store.state.umtg.filterColors = value; }
        }
    }


};
</script>
