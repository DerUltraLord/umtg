var https = require('https');

exports.scryfallGetSets = function(successCallback) {
    getJSON("https://api.scryfall.com/sets", successCallback);
}


exports.getCardByName = function(name, successCallback) {
    function onResponse(res) {
        if (res.total_cards != 1) {
            throw "Error getting card " + name + " from scryfall";
        } else {
            successCallback(res.data[0]);
        }

    }
    getJSON("https://api.scryfall.com/cards/search?q=%21\"" + name.replace(" ", "+") + "\"", onResponse);
}

exports.search = function(searchText, success, fail) {
    getJSON("https://api.scryfall.com/cards/search?order=cmc&q=" + searchText, success);
}


getJSON = function(url, callback, fail) {
    
    res = https.get(url, res => {
        res.setEncoding("utf8");
        let body = "";
        res.on("data", data => {
            body += data;
        });
        res.on("end", () => {
            body = JSON.parse(body);
            callback(body);
        });
        if (fail) {
            res.on("error", (e) => {
                fail();
            });
        }
    });

}
