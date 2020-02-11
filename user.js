const db = require('./db');

module.exports = class User {
	constructor(user_id, username) {
		this.user_id = user_id;
		this.username = username;
	}

	static async load(user_id) {
		const user = await db.findOne({ user_id: user_id });
		if (user) return new User(user.user_id, user.username);
		else return null;
	}

	static async addUser(user_id, username) {
		const user = await db.findOne({ user_id: user_id });
		if (!user) await db.insert({ user_id: user_id, username: username });
	}

	static removeUser(user_id) {
		return db.remove({ user_id: user_id });
	}

	static async isModder(user_id) {
		const user = await db.findOne({ user_id: user_id, modder: true });
		return user ? true : false;
	}

	static async addModder(user_id) {
		const user = await db.findOne({ user_id: user_id });
		if (user) {
			user.modder = true;
			await db.update({ user_id: user_id }, user);
		}
	}

	static getAll() {
		return db.find({
			user_id: { $exists: true },
			username: { $exists: true },
		});
	}

	get user() {
		return {
			user_id: this.user_id,
			username: this.username,
		};
	}
};
