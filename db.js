const Datastore = require('nedb-promises');
const db = Datastore.create('database.db');
db.load();
db.ensureIndex({ fieldName: 'date' });
module.exports = db;
