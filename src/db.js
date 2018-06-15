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
    var stmt = db.prepare("INSERT INTO Card VALUES(?, ?, ?, ?)");
    // TODO: foil
    stmt.run(card.id, JSON.stringify(card), amount, 0);
    stmt.finalize();
};

exports.setAdd = function(set) {
    var stmt = db.prepare("INSERT INTO [Set] VALUES(?, ?)");
    stmt.run(set.code, JSON.stringify(set));
    stmt.finalize();
};

exports.cardExistsByName = function(cardname) {
    let stmt = "SELECT EXISTS(SELECT * FROM Card where json_extract(Card.jsonString, '$.name') = '" + dbString(cardname) + "') as ex";
    return exports._promiseStatementWithDataTransform(stmt, res => res[0].ex > 0);
};

exports.cardAdjustAmount = function(card, amount, callback) {

    function stmtFinished(err, res) {
        if (res.length == 0) {
            if (amount > 0) {
                exports.cardAdd(card, 1);
            }
        } else {
            var newAmount = res[0].amount + amount;
            if (newAmount >= 0) {
                var stmt = db.prepare("UPDATE Card set amount = ? where id = ?");
                stmt.run(res[0].amount + amount, res[0].id);
                stmt.finalize();
            }
        }

        callback();
    }

    db.all("SELECT * FROM Card where id = '" + card.id + "'", stmtFinished);
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

exports.getCardByName = function(name) {
    function transform(res) {
        if (res.length == 1) {
            return JSON.parse(res[0].jsonString);
        }
    }
    return exports._promiseStatementWithDataTransform("SELECT * FROM Card where json_extract(Card.jsonString, '$.name') = '" + dbString(name) + "'",
        transform);
};

exports.getSets = function(types) {

    let stmt = "SELECT *, json_extract([Set].jsonString, '$.released_at') as released_at FROM [Set]";
    if (types != undefined) {
        stmt += " WHERE json_extract([Set].jsonString, '$.set_type') in (" + types.map(type => `'${type}'`).join(",") + ")";
    }
    stmt += " ORDER BY released_at desc";

    return exports._promiseStatement(stmt);
};


exports.getCardsOfSet = function(set, callback) {
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
        db.all(stmt, onFinished);
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


