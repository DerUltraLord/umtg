import * as Base from './base';
import { Card, Dict } from './umtgTypes';

export function scryfallGetSets() : Promise<any> {
    return Base.getJSON('https://api.scryfall.com/sets');
}

export async function getCardByName(name: string): Promise<Card> {
    let result: Card[] = await scryfallReqest<Card>('https://api.scryfall.com/cards/search?q=' + name.replace(/ /g, '+'));
    if (result.length > 0) {
        return result[0];
    } else {
        throw Error("card not found");
    }
}

export function search<T>(searchText: string): Promise<T[]> {
    return scryfallReqest<T>('https://api.scryfall.com/cards/search?order=cmc&q=' + searchText);
}

export async function scryfallReqest<T>(uri: string): Promise<T[]> {
    let response: any = await Base.getJSON(uri);
    let result: T[] = [];
    if (!response.data) {
        throw Error("no data for request " + uri);
    }
    for (const d of response.data) {
        result.push(d as T);
    }

    if (response.has_more) {
        let hasMoreResult = await scryfallReqest<T>(response.next_page);
        result.push(...hasMoreResult);
    }

    return result;
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

export async function searchByFilter(filter: any): Promise<Card[]> {
    let searchString = exports.buildSearchString(filter);
    return search<Card>(searchString);
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
