var sqlite3 = require('sqlite3').verbose();
const async = require('async');

var db = null;


exports.init = function(name) {
    db = new sqlite3.Database(name);
    db.serialize(function() {
        db.run("CREATE TABLE IF NOT EXISTS Card (id TEXT PRIMARY KEY, jsonString TEXT, amount INTEGER, foilAmount INTEGER)");
        db.run("CREATE TABLE IF NOT EXISTS [Set] (id TEXT PRIMARY KEY, jsonString TEXT)");
    });
    exports.db = db;
}


dbString = function(s) {
    return s.replace("'", "''");
}

exports.cardAdd = function(card, amount) {
    console.log("Add card " + card.name + " to db with id " + card.id);
    var stmt = db.prepare("INSERT INTO Card VALUES(?, ?, ?, ?)");
    // TODO: foil
    stmt.run(card.id, JSON.stringify(card), 1, 0);
    stmt.finalize();
}

exports.setAdd = function(set, callback) {
    var stmt = db.prepare("INSERT INTO [Set] VALUES(?, ?)");
    stmt.run(set.code, JSON.stringify(set), callback);
    stmt.finalize();
}

exports.cardExistsByName = function(cardname, callback) {
    function stmtFinished(err, res) {
        callback(res[0].ex > 0);
    }

    db.all("SELECT EXISTS(SELECT * FROM Card where json_extract(Card.jsonString, '$.name') = '" + dbString(cardname) + "') as ex", stmtFinished);
}

exports.cardAdjustAmount = function(card, amount, callback) {

    function stmtFinished(err, res) {
        console.log(err);

        if (res.length == 0) {
            if (amount > 0) {
                exports.cardAdd(card, 1);
            }
        } else {
            var newAmount = res[0].amount + amount
            if (newAmount >= 0) {
                var stmt = db.prepare("UPDATE Card set amount = ? where id = ?");
                stmt.run(res[0].amount + amount, res[0].id)
                stmt.finalize();
            }
        }

        callback();
    }

    db.all("SELECT * FROM Card where id = '" + card.id + "'", stmtFinished);
}

exports.getAmountOfCard = function(id, callback) {
    
    // TODO: foil
    //
    function stmtFinished(err, res) {
        var result = 0
        if (res.length > 0) {
            result = res[0].amount;
        }
        callback(result);

    }   

    db.all("SELECT * FROM Card where id = '" + id + "'", stmtFinished);

}

exports.getCardByName = function(name, callback) {
    function stmtFinished(err, res) {
        if (res.length == 1) {
            callback(JSON.parse(res[0].jsonString));
        }
    }

    db.all("SELECT * FROM Card where json_extract(Card.jsonString, '$.name') = '" + dbString(name) + "'", stmtFinished);
}

exports.cardInDbByName = function(name, callback) {

    function stmtFinished(err, res) {
        //callback(res.length > 0);
    }
    db.all("SELECT * FROM Card where json_extract(Card.jsonString, '$.name') = '" + dbString(name) + "'", stmtFinished);
}

exports.getSets = function(callback, types) {
    function stmtFinished(err, res) {
        callback(res);
    }
    stmt = "SELECT * FROM [Set]";
    if (types != undefined) {
        stmt += " WHERE json_extract([Set].jsonString, '$.set_type') in (" + types.map(type => `'${type}'`).join(',') + ")";
        
    }
    db.all(stmt, stmtFinished);
}


