<card-search>
    <form class="cardSearchContainer" onsubmit={onSearch}>
        <label>Name:</label>
        <input placeholder="Name or Scryfall search" type="text" ref="searchName"></input>
        <label>Type:</label>
        <input placeholder="Creature" ref="searchType"></input>
        <label>Text:</label>
        <input placeholder="Oracle Text" ref="searchText"></input>
        <label>Edition:</label>
        <input placeholder="XLN" ref="searchEdition"></input>
        <button id="searchButton">Search</Search>
    </form>
    <style>
        .cardSearchContainer {
            display: grid;
            grid-gap: 10px;
            grid-template-columns: 80px 1fr;
        }
    </style>
    <script>
        onSearch(e) {
            e.preventDefault();

            filter = scry.getSearchFilter(this.refs.searchName.value,
                                          this.refs.searchType.value,
                                          this.refs.searchText.value,
                                          this.refs.searchEdition.value)
            this.opts.callback(filter);
        }
    </script>
</card-search>
