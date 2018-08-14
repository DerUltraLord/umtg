import * as base from './base';
import { Card, Dict } from './umtgTypes';

export function scryfallGetSets() : any {
    return base.getJSON('https://api.scryfall.com/sets');
}

export function getCardByName(name: string): Promise<Card> {
    return base.getJSONTransformed('https://api.scryfall.com/cards/search?q=' + name.replace(/ /g, '+'), (res: any) => {
        return res.data[0] as Card;
    }) as Promise<Card>;
}

export function search(searchText: string): Promise<string> {
    return base.getJSON('https://api.scryfall.com/cards/search?order=cmc&q=' + searchText);
}

export function buildSearchString(filter: any): any {
    let res = filter['name'];
    for (let property in filter) {
        if (property !== 'name') {
            let splitted = filter[property].split(' ');
            for (let index in splitted) {
                res += ' ' + property + splitted[index];
            }

        }
    }
    return res;
}

export function searchByFilter(filter: any): any {
    let searchString = exports.buildSearchString(filter);
    return exports.search(searchString);
}

let applyRegex = function(re: RegExp, a: string, b: string): [string, string] {
    let m;
    m = re.exec(a);
    while (m !== null) {
        a = a.replace(m[0], '');
        b += ' ' + m[1];
        m = re.exec(a);
    }
    return [a, b];
};

export function getSearchFilter(name: string, type?: string, text?: string, edition?: string): Dict<string> {
    let res: Dict<string> = {};
    type = type || '';
    text = text || '';
    edition = edition || '';
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
}
