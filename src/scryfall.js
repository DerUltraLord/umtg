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
    console.log(searchText);
    getJSON("https://api.scryfall.com/cards/search?order=cmc&q=" + searchText, success);
}

exports.buildSearchString = function(filter) {
    res = filter['name'];
    for (var property in filter) {
        if (property != 'name') {
            splitted = filter[property].split(' ');
            for (var index in splitted) {
                res += ' ' + property + splitted[index];
            }

        }
    }
    return res
}

exports.searchByFilter = function(filter, success, fail) {
    searchString = this.buildSearchString(filter);
    exports.search(searchString, success, fail);
}

exports.getSearchFilter = function(name, type, text, edition) {
    res = {};
    // type
    reType = /\s?t:(\w+)/g;
    regResult = applyRegex(reType, name, type);
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

    res['name'] = name;


    if (type) {
        res['t:'] = type;
    }

    if (text) {
        res['o:'] = text;
    }

    if (edition) {
        res['e:'] = edition;
    }
    return res;
}

applyRegex = function(re, a, b) {
    while (m = re.exec(a)) {
        a = a.replace(m[0], '');
        b += ' ' + m[1];
    }
    return [a, b];
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
