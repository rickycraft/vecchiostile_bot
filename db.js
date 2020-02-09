const Datastore = require('nedb-promises');
const db = Datastore.create('database.db');
db.load();
module.exports = db;
