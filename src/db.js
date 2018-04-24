var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('test.db');

db.serialize(function() {
    db.run("CREATE TABLE Card (id TEXT PRIMARY KEY, jsonString TEXT, amount INTEGER, foilAmount INTEGER)");
});


function DB () {
}

DB.cardAdjustAmount = function(card, amount, callback) {

    function stmtFinished(err, res) {

        if (res.length == 0) {
            if (amount > 0) {
                var stmt = db.prepare("INSERT INTO Card VALUES(?, ?, ?, ?)");
                // TODO: foil
                stmt.run(card.id, JSON.stringify(card), 1, 0);
                stmt.finalize();
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

DB.getAmountOfCard = function(id, callback) {
    
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



