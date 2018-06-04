<search-page>
    <card-search class="leftContent" callback={onSearchEntered}></card-search>
    <card-list></card-list>

    <style>
        search-page {
            height: 100%;
            display: grid;
            grid-gap: 10px;
            grid-template-columns: 300px 3fr;
        }

    </style>
   
    <script type="es6">
        /* global riot, scry */
        riot.mount("card-search");
        riot.mount("card-list"); 

        this.onSearchEntered = filter => {
            //scry.search(searchText, this.onDataAvailable, this.onDataNotAvailable)
            scry.searchByFilter(filter, this.onDataAvailable, this.onDataNotAvailable);
            
        };

        this.onDataAvailable = data => {
            this.tags["card-list"].opts.cards = data.data;
            this.tags["card-list"].update();
            
        };

        this.onDataNotAvailable = () => {
            this.tags["card-list"].trigger("data_loaded", {});
            
        };

    
    </script>
</search-page>
