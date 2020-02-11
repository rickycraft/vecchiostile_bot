const moment = require('moment');
moment.locale('it');
const db = require('./db');
const messages = require('./messages');

module.exports = class Trasferta {
	constructor(date, where, trasferta) {
		this.date = date;
		this.where = where;
		this.trasferta = trasferta;
	}

	save() {
		return db.insert({
			date: this.date,
			where: this.where,
			trasferta: this.trasferta,
		});
	}

	static parseDate(date) {
		// 9/2/20 15:40
		const parsed = moment(date, 'DD-MM-YY HH:mm');
		if (parsed.isValid()) return parsed.toDate();
		else throw new Error('invalid date');
	}

	static parse(msg) {
		const parsed = msg.text.split('\n');
		const date = this.parseDate(parsed[1]);
		const where = parsed[2];
		const body = parsed.slice(3).join('\n');
		return new Trasferta(date, where, body);
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

	static getTrasferte(n) {
		const curr_date = new Date();
		return db
			.find({
				trasferta: { $exists: true },
				where: { $exists: true },
				date: { $gte: curr_date },
			})
			.sort({ date: 1 })
			.limit(n);
	}

	static async deleteTrasferta() {
		const curr_date = new Date();
		const trasferta = await db
			.find({
				trasferta: { $exists: true },
				where: { $exists: true },
				date: { $gte: curr_date },
			})
			.sort({ date: 1 })
			.limit(1);
		await db.remove(trasferta[0]);
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
