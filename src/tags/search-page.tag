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
   
    <script>
        riot.mount('card-search');
        riot.mount('card-list'); 

        onSearchEntered(filter) {
            //scry.search(searchText, this.onDataAvailable, this.onDataNotAvailable)
            scry.searchByFilter(filter, this.onDataAvailable, this.onDataNotAvailable);
            
        }

        onDataAvailable(data) {
            console.log(data);
            //this.tags['card-list'].trigger('data_loaded', data.data);
            this.tags['card-list'].opts.cards = data.data;
            this.tags['card-list'].update();
            
        }

        onDataNotAvailable() {
            this.tags['card-list'].trigger('data_loaded', {});
            
        }

    
    </script>
</search-page>
