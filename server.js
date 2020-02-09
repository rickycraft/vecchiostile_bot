require('dotenv').config();

// telegraf
const Telegraf = require('telegraf');
const bot = new Telegraf(process.env.BOT_TOKEN);

// database
const db = require('./db');

const messages = require('./messages');

// Classes
const Trasferta = require('./trasferta');
const User = require('./user');
const News = require('./news');

bot.start(async ctx => {
	await User.addUser(ctx.from.id, ctx.from.username);
	ctx.reply(messages.welcome);
});

bot.hears('iscrizione news', async ctx => {
	const user = new User(ctx.from.id);
	await user.load();
	if (user.news) {
		ctx.reply(messages.already_sub_news);
	} else {
		user.news = true;
		await user.update();
		ctx.reply(messages.sub_news);
	}
});

bot.hears('annulla iscrizione news', async ctx => {
	const user = new User(ctx.from.id);
	await user.load();
	if (user.news) {
		user.news = false;
		await user.update();
		ctx.reply(messages.unsub_news);
	} else {
		ctx.reply(messages.notsub_news);
	}
});

bot.hears(/inserisci news\n[\s\S]*/gm, async ctx => {
	const news = News.parse(ctx);
	await news.save();
	ctx.reply(messages.added_news);
});

bot.hears('pubblica news', async ctx => {
	let news = (await News.latest())[0];
	news = News.load(news);
	ctx.reply(news.show());
});

bot.hears(/aggiungi trasferta\n[\s\S]*/gm, async ctx => {
	const trasferta = Trasferta.parse(ctx.message);
	await trasferta.save(ctx.from.id);
	ctx.reply('Trasferta aggiunta');
});

bot.hears('trasferte', async ctx => {
	ctx.reply('Queste sono le trasferte in arrivo: ');
	const trasferte = await Trasferta.getTrasferte();
	ctx.reply(Trasferta.show(trasferte));
});

bot.command('alltrasferte', async ctx => {
	ctx.reply("Queste sono tutte le trasferte dell'anno");
	const trasferte = await Trasferta.getAllTrasferte();
	ctx.reply(Trasferta.show(trasferte));
});

bot.hears('test', async ctx => {
	console.log(ctx);
});

bot.startPolling();
