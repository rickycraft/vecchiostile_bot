const db = require('./db');
module.exports = class News {
	constructor(news_body, date) {
		this.news_body = news_body;
		this.date = date ? date : new Date();
	}

	static parse(message) {
		const parsed = message.text.split('\n');
		const body = parsed.slice(1).join('\n');
		return new News(body);
	}

	delete() {
		return db.remove({ news_body: this.news_body });
	}

	save() {
		return db.insert(this.news);
	}

	get news() {
		return {
			news_body: this.news_body,
			date: this.date,
		};
	}

	show() {
		return this.news_body;
	}

	static async latest() {
		const arr = await db
			.find({
				news_body: { $exists: true },
			})
			.sort({ date: -1 })
			.limit(1);
		if (arr.length == 0) return new News('non ci sono news');
		else return new News(arr[0].news_body, arr[0].date);
	}
};
