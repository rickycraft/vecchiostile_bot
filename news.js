const db = require('./db');
const User = require('./user');
const Photo = require('./photo');
const telegram = require('./bot').telegram;

module.exports = class News {
	constructor() {}

	static async parse(message) {
		const parsed = message.text.split('\n');
		const body = parsed.slice(1).join('\n');
		const news = {
			news_body: body,
			date: new Date(),
		};
		await db.insert(news);
	}

	static async public(id, isphoto) {
		const flag = await User.isModder(id);
		if (!flag) return;

		let news = this.latest();
		let users = User.getAll();
		let photo;
		if (isphoto) {
			photo = await Photo.latest();
		}
		news = await news;
		users = await users;

		if (news)
			users.forEach(user => {
				telegram.sendMessage(user.user_id, news.news_body);
				if (isphoto && photo)
					telegram.sendPhoto(user.user_id, photo.photo_id);
			});
		else telegram.sendMessage(id, 'non ci sono news');
	}

	static async removeLatest() {
		const news = await this.latest();
		if (news) return db.remove(news);
		else return 0;
	}

	static async latest() {
		const arr = await db
			.find({
				news_body: { $exists: true },
			})
			.sort({ date: -1 })
			.limit(1);
		if (arr.length > 0) return arr[0];
		else return null;
	}
};
