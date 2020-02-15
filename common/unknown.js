const db = require('../database/database');

const insert = text => db.insert({ command: text });
const all = () => db.find({ command: { $exists: true } });
const clear = () => db.remove({ command: { $exists: true } }, { multi: true });

module.exports = {
	insert: insert,
	all: all,
	clear: clear,
};
