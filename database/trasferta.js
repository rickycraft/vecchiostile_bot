const db = require('./database');
const moment = require('moment');
moment.locale('it');

parseDate = date => {
	// 9/2/20 15:40
	const parsed = moment(date, 'DD-MM-YY HH:mm');
	if (parsed.isValid()) return parsed.toDate();
	else throw new Error('invalid date');
};

module.exports = class Trasferta {
	constructor() {}

	static insert(match) {
		return db.insert({
			date: parseDate(match[1]),
			where: match[2],
			trasferta: match[3],
			crate_date: new Date(),
		});
	}

	static show(trasferta) {
		const date = moment(trasferta.date);
		const data =
			date.format('dddd D MMMM YYYY') + ' alle ' + date.format('HH:mm');
		return `<pre>${trasferta.where}, ${data}</pre>\n${trasferta.trasferta}`;
	}

	static upcoming(n) {
		const curr_date = new Date();
		if (n < 1) n = 1;
		return db
			.find({
				trasferta: { $exists: true },
				where: { $exists: true },
				date: { $gte: curr_date },
			})
			.sort({ date: 1 })
			.limit(n);
	}

	static async latest() {
		const trasferta = await db
			.find({
				trasferta: { $exists: true },
				where: { $exists: true },
			})
			.sort({ crate_date: -1 })
			.limit(1);
		return trasferta.length == 1 ? trasferta[0] : null;
	}

	static all() {
		return db
			.find({
				trasferta: { $exists: true },
				where: { $exists: true },
			})
			.sort({ date: 1 });
	}

	static async remove() {
		const trasferta = await this.latest();
		return trasferta ? db.remove(trasferta) : 0;
	}
};
