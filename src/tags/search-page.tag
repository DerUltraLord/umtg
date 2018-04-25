<search-page>
    <card-search class="box content1" callback={onSearchEntered}></card-search>
    <card-list class="content2 scrollable" id="cardResult"></card-list>
    <div class="content3"><p>Content3</p></div>
    <div class="box footer">
        <button>add</button>
        <button>remve</button>
    </div>

    <style>
        search-page {
            display: grid;
            height: 93vh;
            grid-gap: 10px;
            grid-template-columns: 300px 3fr 2fr;
            grid-template-rows: 1fr 80px;
            grid-template-areas: "content1 content2 content3" "footer footer footer";
        }

        .content1 {
            grid-area: content1;
        }

        .content2 {
            grid-area: content2;
        }

        .content3 {
            grid-area: content3;
        }

        .footer {
            grid-area: footer;
        }
    </style>
   
    <script>
        riot.mount('card-search');
        riot.mount('card-list'); 

        onSearchEntered(searchText) {
            scry.search(searchText, this.onDataAvailable, this.onDataNotAvailable)
            
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
