const db = require('./db');
module.exports = class News {
	constructor(news, id) {
		this.news_body = news;
		this.userId = id;
		this.date = new Date();
	}

	static parse(ctx) {
		const parsed = ctx.message.text.split('\n');
		const body = parsed.slice(1).join('\n');
		return new News(body, ctx.from.id);
	}

	static load(news) {
		const n = new News(news.news_body, news.userId);
		n.date = news.date;
		return n;
	}

	get obj() {
		return {
			news_body: this.news_body,
			userId: this.userId,
			date: this.date,
		};
	}

	save() {
		return db.insert(this.obj);
	}

	show() {
		return this.news_body;
	}

	static latest() {
		return db
			.find({
				news_body: { $exists: true },
			})
			.sort({ date: -1 })
			.limit(1);
	}
};
