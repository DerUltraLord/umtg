<search-page>
    <card-search callback={onSearchEntered}></card-search>
    <card-list class="scrollable" id="cardResult"></card-list>

    <style>
        search-page {
            display: grid;
            height: 100%;
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
            this.tags['card-list'].trigger('data_loaded', data.data);
            
        }

        onDataNotAvailable() {
            this.tags['card-list'].trigger('data_loaded', {});
            
        }

    
    </script>
</search-page>
