const db = require('./database');

module.exports = class Photo {
	constructor() {}

	static async latest() {
		const photos = await db
			.find({
				photo_id: { $exists: true },
			})
			.sort({ date: -1 })
			.limit(1);
		if (photos.length > 0) return photos[0];
		else return null;
	}

	static async removeLatest() {
		const photo = await this.latest();
		if (photo) return db.remove(photo);
		else return 0;
	}

	static insert(photo_id) {
		return db.insert({
			photo_id: photo_id,
			date: new Date(),
		});
	}
};
