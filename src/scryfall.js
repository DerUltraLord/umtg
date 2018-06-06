const utils = require("./utils.js");


exports.scryfallGetSets = function(successCallback) {
    utils.getJSON("https://api.scryfall.com/sets", successCallback);
};

exports.getCardByName = function(name, successCallback) {
    function onResponse(res) {
        if (res.total_cards != 1) {
            throw "Error getting card " + name + " from scryfall";
        } else {
            successCallback(res.data[0]);
        }

    }
    utils.getJSON("https://api.scryfall.com/cards/search?q=%21\"" + name.replace(" ", "+") + "\"", onResponse);
};

exports.search = function(searchText, success, fail) {
    if (fail) {
        throw new Error(fail);
    }
    utils.getJSON("https://api.scryfall.com/cards/search?order=cmc&q=" + searchText, success);
};

exports.buildSearchString = function(filter) {
    let res = filter["name"];
    for (var property in filter) {
        if (property != "name") {
            let splitted = filter[property].split(" ");
            for (var index in splitted) {
                res += " " + property + splitted[index];
            }

        }
    }
    return res;
};

exports.searchByFilter = function(filter, success, fail) {
    let searchString = this.buildSearchString(filter);
    exports.search(searchString, success, fail);
};

exports.getSearchFilter = function(name, type, text, edition) {
    let res = {};
    // type
    let reType = /\s?t:(\w+)/g;
    let regResult = applyRegex(reType, name, type);
    name = regResult[0];
    type = regResult[1];

    // text
    reType = /\s?o:(\w+)/g;
    regResult = applyRegex(reType, name, text);
    name = regResult[0];
    text = regResult[1];

    // edition
    reType = /\s?e:(\w+)/g;
    regResult = applyRegex(reType, name, edition);
    name = regResult[0];
    edition = regResult[1];

    res["name"] = name;


    if (type) {
        res["t:"] = type;
    }

    if (text) {
        res["o:"] = text;
    }

    if (edition) {
        res["e:"] = edition;
    }
    return res;
};

let applyRegex = function(re, a, b) {
    let m;
    m = re.exec(a);
    while (m != null) {
        a = a.replace(m[0], "");
        b += " " + m[1];
        m = re.exec(a);
    }
    return [a, b];
};


