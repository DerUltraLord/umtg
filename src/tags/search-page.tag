<search-page class="contentSearchPage">
    <card-search class="box content1" callback={onSearchEntered}></card-search>
    <card-list class="content2" id="cardResult"></card-list>
    <div class="content3"><p>Content3</p></div>
    <div class="box footer">
        <button>add</button>
        <button>remve</button>
    </div>
   
    <script>
        riot.mount('card-search');
        riot.mount('card-list'); 

        onSearchEntered(searchText) {
            
            res = $.getJSON("https://api.scryfall.com/cards/search?order=cmc&q=" + searchText, this.onDataAvailable);
            res.fail(this.onDataNotAvailable);
            console.log(res);
            
        }

        onDataAvailable() {
            this.tags['card-list'].trigger('data_loaded', res.responseJSON.data);
            
        }

        onDataNotAvailable() {
            this.tags['card-list'].trigger('data_loaded', {});
            
        }

    
    </script>
</search-page>