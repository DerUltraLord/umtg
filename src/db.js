var sqlite3 = require("sqlite3").verbose();

var db = null;


exports.init = function(name) {
    db = new sqlite3.Database(name);
    db.serialize(function() {
        db.run("CREATE TABLE IF NOT EXISTS Card (id TEXT PRIMARY KEY, jsonString TEXT, amount INTEGER, foilAmount INTEGER)");
        db.run("CREATE TABLE IF NOT EXISTS [Set] (id TEXT PRIMARY KEY, jsonString TEXT)");
    });
    exports.db = db;
};


let dbString = function(s) {
    return s.replace("'", "''");
};

exports.cardAdd = function(card, amount) {
    // NOTE: slow
    //exports.cardExistsById(card.id)
    //.then((exists) => {
    //    if (!exists) {
    //        var stmt = db.prepare("INSERT INTO Card VALUES(?, ?, ?, ?)");
    //        stmt.run(card.id, JSON.stringify(card), amount, 0);
    //        stmt.finalize();
    //    } else {
    //        console.log(card.name + " already in db");
    //    }
    //})
    //.catch(console.error);
    var stmt = db.prepare("INSERT INTO Card VALUES(?, ?, ?, ?)");
    stmt.run(card.id, JSON.stringify(card), amount, 0, (err, data) => {
        if (String(err).includes("SQLite: UNIQUE constraint failed") === -1) {
                throw err;
        } else {
            console.log(card.name + " already in db");
        }
    });
    stmt.finalize();
};

exports.setAdd = (set) => {
    var stmt = db.prepare("INSERT INTO [Set] VALUES(?, ?)");
    stmt.run(set.code, JSON.stringify(set));
    stmt.finalize();
};

exports.getCardAmountOfSet = (set) => {
    let stmt = "SELECT json_extract([Set].jsonString, '$.card_count') as card_count FROM [Set] WHERE json_extract([Set].jsonString, '$.code') = '" + set.code + "'";
    return exports._promiseStatementWithDataTransform(stmt, (res) => {
        if (res.length == 1) {
            return res[0]['card_count'];
        } else {
            return -1;
        }
    });
};

exports.getOwnedCardAmountOfSet = (set) => {
    let stmt = "SELECT COUNT(*) as amount FROM [Card] WHERE json_extract([Card].jsonString, '$.set') = '" + set.code + "' and amount > 0";
    return exports._promiseStatementWithDataTransform(stmt, (res) => {
        if (res.length == 1) {
            return res[0].amount;
        } else {
            return 0;
        }
    });
};

exports.getPercentageOfSet = (set) => {
    return new Promise((success, failure) => {

        console.log("start")
        exports.getOwnedCardAmountOfSet(set)
        .then((amount) => {
            console.log("after getting owned amount")
            if (amount > 0) {
                exports.getCardAmountOfSet(set)
                .then((cardCount) => {
                    console.log("after getting amount")
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
};

exports.cardExistsByName = function(cardname) {
    let stmt = "SELECT EXISTS(SELECT * FROM Card where json_extract(Card.jsonString, '$.name') = '" + dbString(cardname) + "') as ex";
    return exports._promiseStatementWithDataTransform(stmt, res => res[0].ex > 0);
};

exports.cardExistsById = function(cardid) {
    let stmt = "SELECT EXISTS(SELECT * FROM Card where json_extract(Card.jsonString, '$.id') = '" + dbString(cardid) + "') as ex";
    return exports._promiseStatementWithDataTransform(stmt, res => res[0].ex > 0);
};


exports.cardAdjustAmount = function(card, amount) {

    return new Promise((success, failure) => {

        exports._promiseStatement("SELECT * FROM Card where id = '" + card.id + "'")
        .then((res) => {
            if (res.length > 0) {
                var newAmount = res[0].amount + amount;
                if (newAmount >= 0) {
                    var stmt = db.prepare("UPDATE Card set amount = ? where id = ?");
                    stmt.run(res[0].amount + amount, res[0].id);
                    stmt.finalize();
                    resultAmount = newAmount;
                } else {
                    resultAmount = 0;
                }
                success(resultAmount)

            } else {
                failure("card not in db");
            }
        })
        .catch(failure);

    });

};

exports.getAmountOfCard = function(id, callback) {
    
    // TODO: foil
    //
    function stmtFinished(err, res) {
        var result = 0;
        if (res.length > 0) {
            result = res[0].amount;
        }
        callback(result);

    }   

    db.all("SELECT * FROM Card where id = '" + id + "'", stmtFinished);

};

exports.getCardByName = (name) => {
    function transform(res) {
        if (res.length > 0) {
            return JSON.parse(res[0].jsonString);
        }
    }
    return exports._promiseStatementWithDataTransform("SELECT * FROM Card where json_extract(Card.jsonString, '$.name') = '" + dbString(name) + "'",
        transform);
};

exports.getSets = (types) => {

    let stmt = "SELECT *, json_extract([Set].jsonString, '$.released_at') as released_at FROM [Set]";
    if (types != undefined) {
        stmt += " WHERE json_extract([Set].jsonString, '$.set_type') in (" + types.map(type => `'${type}'`).join(",") + ")";
    }
    stmt += " ORDER BY released_at desc";

    return exports._promiseStatementWithDataTransform(stmt, sets => sets.map(set => JSON.parse(set.jsonString)));
};


exports.getCardsOfSet = (set) => {
    let stmt = "SELECT * from [Card] WHERE json_extract([Card].jsonString, '$.set') = '" + set.code + "'";
    return exports._promiseStatementWithDataTransform(stmt, cards => cards.map(card => JSON.parse(card.jsonString)));

};

exports._promiseStatement = stmt => {
    let res = new Promise((resolve, reject) => {
        function onFinished(err, dbResult) {
            if (err) {
                reject(err);
            } else {
                resolve(dbResult);
            }
        }
        console.log("before all");
        db.all(stmt, onFinished);
        console.log("after all");
    });
    return res;
};

exports._promiseStatementWithDataTransform = (stmt, transformFunc) => {
    return new Promise((success, failure) => {
        exports._promiseStatement(stmt)
        .then((res) => success(transformFunc(res)))
        .catch(failure);
    });
};


