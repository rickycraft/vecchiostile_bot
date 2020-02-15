const db = require('./database');

module.exports = class User {
	constructor() {}

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

	static all() {
		return db.find({
			user_id: { $exists: true },
		});
	}
};
