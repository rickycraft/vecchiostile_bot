const moment = require('moment');
moment.locale('it');
const db = require('./db');
const messages = require('./messages');

module.exports = class Trasferta {
	constructor() {}

	save(id) {
		return db.insert({
			date: this.date,
			where: this.where,
			trasferta: this.trasferta,
			userId: id,
		});
	}

	static parseDate(date) {
		// 9/2/20 15:40
		const parsed = moment(date, 'DD-MM-YY HH:mm');
		if (parsed.isValid()) return parsed.toDate();
		else throw new Error('invalid date');
	}

	static parse(msg) {
		const t = new Trasferta();
		const parsed = msg.text.split('\n');
		t.date = this.parseDate(parsed[1]);
		t.where = parsed[2];
		t.trasferta = parsed.slice(3).join('\n');
		return t;
	}

	static showOne(trasferta) {
		const date = moment(trasferta.date);
		const data =
			date.format('dddd D MMMM YYYY') + ' alle ' + date.format('HH:mm');
		return `${trasferta.where}, ${data}\n\n${trasferta.trasferta}`;
	}

	static show(arr) {
		if (arr.length > 0)
			return arr.map(t => this.showOne(t)).join('\n##########\n');
		else return messages.no_trasferte;
	}

	static getTrasferte() {
		const curr_date = new Date();
		return db
			.find({
				trasferta: { $exists: true },
				where: { $exists: true },
				date: { $gte: curr_date },
			})
			.sort({ date: 1 })
			.limit(3);
	}

	static getAllTrasferte() {
		return db
			.find({
				trasferta: { $exists: true },
				where: { $exists: true },
				date: { $exists: true },
			})
			.sort({ date: 1 });
	}
};
