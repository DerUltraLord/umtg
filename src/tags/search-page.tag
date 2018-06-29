<search-page>
    <card-search class="leftContent" callback={onSearchEntered}></card-search>

    <div class="scrollable">
        <card-list></card-list>
        <loader></loader>
    </div>


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
        this.loading = false;

        this.onSearchEntered = filter => {
            this.tags['loader'].show();
            scry.searchByFilter(filter)
            .then(this.onDataAvailable)
            .catch(this.onDataNotAvailable);
        };

        this.onDataAvailable = data => {
            this.tags["card-list"].opts.cards = data.data;
            this.tags["card-list"].update();
            this.tags['loader'].hide();
            
        };

        this.onDataNotAvailable = () => {
            this.tags["card-list"].trigger("data_loaded", {});
            this.tags['loader'].hide();
        };

    
    </script>
</search-page>
