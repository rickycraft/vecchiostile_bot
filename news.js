const db = require('./db');

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
