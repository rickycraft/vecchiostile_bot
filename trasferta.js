const moment = require('moment');
moment.locale('it');

const db = require('./db');

parseDate = date => {
	// 9/2/20 15:40
	const parsed = moment(date, 'DD-MM-YY HH:mm');
	if (parsed.isValid()) return parsed.toDate();
	else throw new Error('invalid date');
};

module.exports = class Trasferta {
	constructor() {}

	static insert(msg) {
		const parsed = msg.text.split('\n');
		const date = parseDate(parsed[1]);
		const where = parsed[2];
		const body = parsed.slice(3).join('\n');
		return db.insert({
			date: date,
			where: where,
			trasferta: body,
		});
	}

	static show(trasferta) {
		const date = moment(trasferta.date);
		const data =
			date.format('dddd D MMMM YYYY') + ' alle ' + date.format('HH:mm');
		return `<pre>${trasferta.where}, ${data}</pre>${trasferta.trasferta}`;
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

	static all() {
		return db
			.find({
				trasferta: { $exists: true },
				where: { $exists: true },
			})
			.sort({ date: 1 });
	}

	static async removeLast() {
		const curr_date = new Date();
		const trasferte = await db
			.find({
				trasferta: { $exists: true },
				where: { $exists: true },
			})
			.sort({ date: -1 })
			.limit(1);

		if (trasferte.length > 0) return db.remove(trasferte[0]);
		else return 0;
	}
};
