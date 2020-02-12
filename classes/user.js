const API = require('./api');
const Photo = require('../photo/photo');
const db = require('../database/db');

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

	static async public(msg, isphoto) {
		let users = this.all();
		let photo = null;
		if (isphoto) photo = await Photo.latest();
		users = await users;

		users.forEach(user => {
			API.telegram.sendMessage(user.user_id, msg, API.Extra.HTML());
			if (isphoto && photo)
				API.telegram.sendPhoto(user.user_id, photo.photo_id);
		});
	}
};
