require('dotenv').config();

// telegraf
const Telegraf = require('telegraf');
const bot = new Telegraf(process.env.BOT_TOKEN);

// database
const Datastore = require('nedb-promises');
const db = Datastore.create('database.db');
db.load();

const messages = require('./messages');

bot.start(ctx => {
	console.log(ctx.from);
	ctx.reply(messages.welcome);
	ctx.reply('test');
});

bot.hears('iscrizione news', async ctx => {
	let user = await db.findOne({ id: ctx.from.id });
	if (!user) {
		user = ctx.from;
		user.news = true;
		await db.insert(user);
		ctx.reply(messages.sub_news);
	} else {
		ctx.reply(messages.already_sub_news);
	}
});

bot.hears('annulla iscrizione news', async ctx => {
	let user = await db.findOne({ id: ctx.from.id });
	if (user) {
		if (user.news) {
			await db.update({ _id: user._id }, { $set: { news: false } });
			ctx.reply(messages.unsub_news);
		}
	} else {
		ctx.reply(messages.notsub_news);
	}
});

bot.hears('trasferte', async ctx => {
	let curr_date = new Date();

	const trasferte = await db
		.find({
			body: { $exists: true },
			date: { $gte: curr_date },
		})
		.sort({ date: -1 })
		.limit(3);
	if (trasferte.length == 0) ctx.reply(messages.no_trasferte);
	else {
		trasferte.forEach(trasferta => {
			ctx.reply(showTrasferta(trasferta));
		});
	}
});

bot.command('newtrasferta', async ctx => {
	const trasferta = addTrasferta(ctx.message);
	await db.insert(trasferta);
	ctx.reply('trasferta aggiunta');
});

function addTrasferta(msg) {
	let trasferta = {
		body: 'trasferta 0',
		where: 'roma',
		date: new Date(2020, 8, 21),
	};
	return trasferta;
}

bot.hears('test', ctx => {
	const curr_date = new Date(2020, 8, 20);
	const now = Date.now();
	console.log(now);
	console.log(curr_date);
	console.log(curr_date > now);
});

function showTrasferta(trasferta) {
	return `La prossima trasferta si terra a ${
		trasferta.where
	} il ${trasferta.date.toDateString()}\n${trasferta.body}`;
}

bot.startPolling();
