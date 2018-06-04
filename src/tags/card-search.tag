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
        <div>
        <div>
        <button type="submit" class="btn btn-primary">Search</Search>
    </form>
    <style>

        .cardSearchContainer {
            display: grid;
            margin-top: 10px;
            margin-left: 10px;
            grid-gap: 10px;
            grid-template-columns: 60px 1fr;
        }
    </style>
    <script type="es6">
        /* global scry */

        this.onSearch = e => {
            e.preventDefault();

            let filter = scry.getSearchFilter(this.refs.searchName.value,
                this.refs.searchType.value,
                this.refs.searchText.value,
                this.refs.searchEdition.value);
            this.opts.callback(filter);
        };
    </script>
</card-search>
