const db = require('./db');
module.exports = class Photo {
	constructor(photo_id, date) {
		this.photo_id = photo_id;
		this.date = date ? date : new Date();
	}

	get photo() {
		return {
			photo_id: this.photo_id,
			date: this.date,
		};
	}

	static async latest() {
		const photos = await db
			.find({
				photo_id: { $exists: true },
			})
			.sort({ date: -1 })
			.limit(1);
		return photos[0];
	}

	save() {
		return db.insert(this.photo);
	}
};
