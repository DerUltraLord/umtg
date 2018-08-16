import { Card, MagicSet } from './umtgTypes';
import { state } from './modules/settings';
import * as sqlite3 from 'sqlite3';

export let db: sqlite3.Database;
let PATH_DB = state.settingsPath;

export function init(dbname: string): void {
    if (!dbname.includes('memory')) {
        dbname = PATH_DB + '/' + dbname;
    }
    db = new sqlite3.Database(dbname);
    db.serialize(() => {
        db.run('CREATE TABLE IF NOT EXISTS Card (id TEXT PRIMARY KEY, jsonString TEXT, amount INTEGER, foilAmount INTEGER)');
        db.run('CREATE TABLE IF NOT EXISTS [Set] (id TEXT PRIMARY KEY, jsonString TEXT)');
    });
    exports.db = db;
}

let dbString = function(s: string): string {
    return s.replace('\'', '\'\'');
};

export function cardAdd(card: Card, amount: number): void {
    let stmt = db.prepare('INSERT INTO Card VALUES(?, ?, ?, ?)');
    stmt.run(card.id, JSON.stringify(card), amount, 0, (err: string) => {
        if (err && !String(err).includes('SQLite: UNIQUE constraint failed')) {
            throw err;
        }
    });
    stmt.finalize();
}

export function setAdd(set: MagicSet): void {
    let stmt = db.prepare('INSERT INTO [Set] VALUES(?, ?)');
    stmt.run(set.code, JSON.stringify(set));
    stmt.finalize();
}

export function getCardAmountOfSet(set: MagicSet): Promise<number> {
    let stmt = 'SELECT json_extract([Set].jsonString, \'$.card_count\') as card_count FROM [Set] WHERE json_extract([Set].jsonString, \'$.code\') = \'' + set.code + '\'';
    return exports._promiseStatementWithDataTransform(stmt, (res: Card[]) => {
        if (res.length === 1) {
            return Number(res[0]['card_count']);
        } else {
            return -1;
        }
    });
}

export function getOwnedCardAmountBySetCode(code: string): Promise<number> {
    let stmt = 'SELECT COUNT(*) as amount FROM [Card] WHERE json_extract([Card].jsonString, \'$.set\') = \'' + code + '\' and amount > 0';
    return exports._promiseStatementWithDataTransform(stmt, (res: Card[]) => {
        if (res.length === 1) {
            return res[0].amount;
        } else {
            return 0;
        }
    });
}

export function getPercentageOfSet(set: MagicSet): Promise<number> {
    return new Promise((success, failure) => {

        exports.getOwnedCardAmountBySetCode(set.code)
            .then((amount: number) => {
                if (amount > 0) {
                    exports.getCardAmountOfSet(set)
                        .then((cardCount: number) => {
                            let res = -1;
                            if (cardCount > 0) {
                                res = amount / cardCount;
                            }
                            success(res);
                        }).
                        catch(failure);
                } else {
                    success(0);
                }
            })
            .catch(failure);
    });
}

export function cardExistsByName(cardname: string): Promise<boolean> {
    let stmt = 'SELECT EXISTS(SELECT * FROM Card where json_extract(Card.jsonString, \'$.name\') = \'' + dbString(cardname) + '\') as ex';
    return exports._promiseStatementWithDataTransform(stmt, (res: any) => res[0].ex > 0);
}

export function cardExistsById(cardid: string): Promise<boolean> {
    let stmt = 'SELECT EXISTS(SELECT * FROM Card where json_extract(Card.jsonString, \'$.id\') = \'' + dbString(cardid) + '\') as ex';
    return exports._promiseStatementWithDataTransform(stmt, (res: any) => res[0].ex > 0);
}

export function cardAdjustAmount(card: Card, amount: number): Promise<number> {

    return new Promise((success, failure) => {

        exports._promiseStatement('SELECT * FROM Card where id = \'' + card.id + '\'')
            .then((res: any) => {
                if (res.length > 0) {
                    let newAmount = res[0].amount + amount;
                    let resultAmount = 0;
                    if (newAmount >= 0) {
                        let stmt = db.prepare('UPDATE Card set amount = ? where id = ?');
                        stmt.run(res[0].amount + amount, res[0].id);
                        stmt.finalize();
                        resultAmount = newAmount;
                    } else {
                        resultAmount = 0;
                    }
                    success(resultAmount);

                } else {
                    failure('card not in db');
                }
            })
            .catch(failure);
    });
}

export async function getAmountOfCardById(id: string): Promise<number> {
    let result = await _promiseStatement('SELECT * FROM Card where id = \'' + id + '\'');
    if (result.length > 0) {
        return result[0].amount;
    }
    return 0;
}


export function getCardByName(name: string): Promise<Card> {
    let transform = (res: any) => {
        if (res.length > 0) {
            return JSON.parse(res[0].jsonString);
        }
    };
    return exports._promiseStatementWithDataTransform('SELECT * FROM Card where json_extract(Card.jsonString, \'$.name\') = \'' + dbString(name) + '\'',
        transform);
}

export function getSets(types?: string[]): Promise<MagicSet[]> {

    let stmt = 'SELECT *, json_extract([Set].jsonString, \'$.released_at\') as released_at FROM [Set]';
    if (types !== undefined) {
        stmt += ' WHERE json_extract([Set].jsonString, \'$.set_type\') in (' + types.map(type => `'${type}'`).join(',') + ')';
    }
    stmt += ' ORDER BY released_at desc';

    return exports._promiseStatementWithDataTransform(stmt, (sets: MagicSet[]) => sets.map((set) => JSON.parse(set.jsonString)));
}


export function getCardsOfSet(set: MagicSet): Promise<Card[]> {
    let stmt = 'SELECT * from [Card] WHERE json_extract([Card].jsonString, \'$.set\') = \'' + set.code + '\'';
    return exports._promiseStatementWithDataTransform(stmt, (cards: Card[]) => cards.map((card) => JSON.parse(card.jsonString)));
}

export function isSetDownloaded(set: MagicSet): Promise<boolean> {
    return getCardsOfSet(set)
        .then((cards: Card[]) => {
            return cards.length > 0;
        });
}

export function _promiseStatement(stmt: string): Promise<any> {
    let res = new Promise((resolve, reject) => {
        function onFinished(err: string, dbResult: any): void {
            if (err) {
                reject(err);
            } else {
                resolve(dbResult);
            }
        }
        db.all(stmt, onFinished);
    });
    return res;
}

export function _promiseStatementWithDataTransform(stmt: string, transformFunc: any): Promise<any> {
    return new Promise((success, failure) => {
        exports._promiseStatement(stmt)
            .then((res: any) => success(transformFunc(res)))
            .catch(failure);
    });
}
