const db = require('./database');

module.exports = class News {
	constructor() {}

	static insert(match) {
		return db.insert({
			news_body: match[1],
			date: new Date(),
		});
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
