<card-search>
    <form onsubmit={onSearch}>
        <input type="text" ref="searchString"></input>
        <button id="searchButton">Search</Search>
    </form>
    <script>
    onSearch(e) {
        e.preventDefault();
        this.opts.callback(this.refs.searchString.value);
    }
    </script>
</card-search>