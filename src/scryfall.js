

function scryfallGetSets(successCallback) {
    res = $.getJSON("https://api.scryfall.com/sets", successCallback);
}


function SCRYFALL () {
}

SCRYFALL.getCardByName = function(name, successCallback) {
    function onResponse(res) {
        if (res.total_cards != 1) {
            throw "Error getting card " + name + " from scryfall";
        } else {
            successCallback(res.data[0]);
        }

    }
    res = $.getJSON("https://api.scryfall.com/cards/search?q=%21\"" + name.replace(" ", "+") + "\"", onResponse);
}
