const moment = require('moment');
moment.locale('it');
const db = require('./db');
const messages = require('./messages');
const User = require('./user');
const Photo = require('./photo');
const telegram = require('./bot').telegram;

module.exports = class Trasferta {
	constructor() {}

	static parseDate(date) {
		// 9/2/20 15:40
		const parsed = moment(date, 'DD-MM-YY HH:mm');
		if (parsed.isValid()) return parsed.toDate();
		else throw new Error('invalid date');
	}

	static insert(msg) {
		const parsed = msg.text.split('\n');
		const date = this.parseDate(parsed[1]);
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
		return `${trasferta.where}, ${data}\n\n${trasferta.trasferta}`;
	}

	static async public(id, isphoto) {
		const flag = await User.isModder(id);
		if (!flag) return;

		let trasferta = this.upcoming(1);
		let users = User.getAll();
		let photo;
		if (isphoto) {
			photo = await Photo.latest();
		}
		trasferta = await trasferta;
		users = await users;

		if (trasferta.length == 1) {
			trasferta = trasferta[0];
			users.forEach(user => {
				telegram.sendMessage(
					user.user_id,
					'Prossima trasferta:\n' + this.show(trasferta)
				);
				if (isphoto && photo)
					telegram.sendPhoto(user.user_id, photo.photo_id);
			});
		} else telegram.sendMessage(id, 'non ci sono trasferte');
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

	static async removeLatest() {
		const trasferte = await this.upcoming(1);
		if (trasferte.length > 0) return db.remove(trasferte[0]);
		else return 0;
	}
};
