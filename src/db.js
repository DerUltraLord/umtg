var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('test.db');

db.serialize(function() {
    db.run("CREATE TABLE Card (id TEXT PRIMARY KEY, jsonString TEXT)");
});

