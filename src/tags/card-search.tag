<card-search>
    <form class="cardSearchContainer" onsubmit={onSearch}>
        <label>Name:</label>
        <input placeholder="Name or Scryfall search" type="text" ref="searchString"></input>
        <label>Type:</label>
        <input placeholder="Creature"></input>
        <label>Text:</label>
        <input placeholder="Oracle Text"></input>
        <label>Edition:</label>
        <input placeholder="XLN"></input>
        <button id="searchButton">Search</Search>
        
    </form>
    <script>
    onSearch(e) {
        e.preventDefault();
        this.opts.callback(this.refs.searchString.value);
    }
    </script>
</card-search>