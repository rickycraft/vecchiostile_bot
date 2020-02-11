const db = require('./db');

module.exports = class User {
	constructor(id) {
		this.id = id;
		this.username = '';
		this.modder = false;
	}

	async load() {
		const user = await db.findOne({ id: this.id });
		this.username = user.username;
		this.modder = user.modder;
	}

	static addUser(id, username) {
		return db.insert({
			id: id,
			username: username,
			news: false,
			modder: false,
		});
	}

	get user() {
		return {
			id: this.id,
			username: this.username,
			modder: this.modder,
		};
	}

	save() {
		return db.insert(this.user);
	}

	update() {
		return db.update({ id: this.id }, this.user);
	}
};
