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
        <form @submit="onSubmit" class="form-inline">
            <select @change="onSortStringChange" v-model="$store.state.umtg.sortString" class="custom-select mr-sm-2">
                <option value="cmc">Mana</option>
                <option value="colors">Color</option>
                <option value="collector_number">Card number</option>
            </select>
            <div class="btn-group">

                <label v-shortkey="['ctrl', 'c']" @shortkey="keyPressed($event)" class="btn" v-bind:class="[ filterColors.includes('C') ? 'btn-light' : 'btn-secondary' ]">
                    <input ref="c" @change="doFilter" type="checkbox" autocomplete="off" value="C" v-model="filterColors">
                    <span><img src="icons/C.svg" width="24"></span>
                </label>
			
                <label v-shortkey="['ctrl', 'w']" @shortkey="keyPressed($event)" class="btn" v-bind:class="[ filterColors.includes('W') ? 'btn-warning' : 'btn-secondary' ]">
                    <input ref="w" @change="doFilter" type="checkbox" autocomplete="off" value="W" v-model="filterColors">
                    <span><img src="icons/W.svg" width="24"></span>
                </label>

                <label v-shortkey="['ctrl', 'u']" @shortkey="keyPressed($event)" class="btn" v-bind:class="[ filterColors.includes('U') ? 'btn-info' : 'btn-secondary' ]">
                    <input ref="u" @change="doFilter" type="checkbox" autocomplete="off" value="U" v-model="filterColors">
                    <span><img src="icons/U.svg" width="24"></span>
                </label>			
            
                <label v-shortkey="['ctrl', 'b']" @shortkey="keyPressed($event)" class="btn" v-bind:class="[ filterColors.includes('B') ? 'btn-dark' : 'btn-secondary' ]">
                    <input ref="b" @change="doFilter" type="checkbox" autocomplete="off" value="B" v-model="filterColors">
                    <span><img src="icons/B.svg" width="24"></span>
                </label>			
            
                <label v-shortkey="['ctrl', 'r']" @shortkey="keyPressed($event)" class="btn" v-bind:class="[ filterColors.includes('R') ? 'btn-danger' : 'btn-secondary' ]">
                    <input ref="r" @change="doFilter" type="checkbox" autocomplete="off" value="R" v-model="filterColors">
                    <span><img src="icons/R.svg" width="24"></span>
                </label>			

                <label v-shortkey="['ctrl', 'g']" @shortkey="keyPressed($event)" class="btn" v-bind:class="[ filterColors.includes('G') ? 'btn-success' : 'btn-secondary' ]">
                    <input ref="g" @change="doFilter" type="checkbox" autocomplete="off" value="G" v-model="filterColors">
                    <span><img src="icons/G.svg" width="24"></span>
                </label>			
		    </div>
            <input @change="doFilter" class="form-control mr-sm-2" style="margin-left: 10px" ytype="search" placeholder="Name filter" aria-label="Name filter" v-model="$store.state.umtg.filterString">
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
        async doFilter() {
            let currentPage = this.$store.state.umtg.currentPage;
            if (["search", "collection", "deck"].includes(currentPage)) {
                await this.$store.dispatch(currentPage + "/filterCards");
                await this.$store.dispatch(currentPage + "/sortCards");
            }
        },
        keyPressed(event) {
            let element = event.target.querySelector('input');
            element.checked = !element.checked;
            element.dispatchEvent(new Event('change'));
        },
        onSortStringChange() {
            let currentPage = this.$store.state.umtg.currentPage;
            this.$store.dispatch(currentPage + "/sortCards");
        },
        onSubmit(e) {
            e.preventDefault();
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

<style scoped>
label input[type="checkbox"] {
    position: fixed;
    z-index: -10;
    opacity: 0;
    left: 0;
    top: 0;
}
</style>
