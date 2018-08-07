import * as base from './base';


export function scryfallGetSets() {
    return base.getJSON('https://api.scryfall.com/sets');
}

export function getCardByName(name) {
    return base.getJSONTransformed('https://api.scryfall.com/cards/search?q=' + name.replace(/ /g, '+'), (res) => {
        return res.data[0];
    });
};

export function search(searchText) { 
    base.getJSON('https://api.scryfall.com/cards/search?order=cmc&q=' + searchText);
}

export function buildSearchString(filter) {
    let res = filter['name'];
    for (var property in filter) {
        if (property != 'name') {
            let splitted = filter[property].split(' ');
            for (var index in splitted) {
                res += ' ' + property + splitted[index];
            }

        }
    }
    return res;
};

export function searchByFilter(filter) {
    let searchString = exports.buildSearchString(filter);
    return exports.search(searchString);
};

export function getSearchFilter(name: string, type? : string, text? : string, edition? : string) {
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
};

let applyRegex = function(re, a, b) {
    let m;
    m = re.exec(a);
    while (m != null) {
        a = a.replace(m[0], '');
        b += ' ' + m[1];
        m = re.exec(a);
    }
    return [a, b];
};


