const db = require('../database/db');

module.exports = class Commands {
	static insert(text) {
		return db.insert({ command: text });
	}

	static all() {
		return db.find({ command: { $exists: true } });
	}

	static clear() {
		return db.remove({ command: { $exists: true } }, { multi: true });
	}
};
