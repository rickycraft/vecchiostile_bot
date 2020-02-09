const db = require('./db');

module.exports = class User {
	constructor(id) {
		this.id = id;
		this.username = '';
		this.news = false;
		this.modder = false;
	}

	async load() {
		const user = await db.findOne({ id: this.id });
		this.username = user.username;
		this.news = user.news;
		this.modder = user.modder;
	}
	/*
		db.findOne({ id: this.id }).then(user => {
			this.username = user.username;
			this.news = user.news;
			this.modder = user.modder;
		});
    */

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
			news: this.news,
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
