require('dotenv').config();

// telegraf
const Telegraf = require('telegraf');
const bot = new Telegraf(process.env.BOT_TOKEN);
const Markup = require('telegraf/markup');

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

bot.command('annullanews', async ctx => {
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

bot.hears(/inserisci news\n[\s\S]*/gim, async ctx => {
	const news = News.parse(ctx);
	await news.save();
	const keyboard = Markup.keyboard([['pubblica news'], ['cancella news']])
		.oneTime()
		.resize()
		.extra();
	ctx.reply(messages.added_news, keyboard);
});

bot.hears(/cancella news/i, async ctx => {
	let news = await News.latest();
	if (news.length > 0) news = news[0];
	else {
		ctx.reply('non ci sono news da cancellare');
		return;
	}
	news = News.load(news);
	await news.delete();
	ctx.reply('News cancellata');
});

bot.hears(/pubblica news/i, async ctx => {
	let news = await News.latest();
	if (news.length > 0) news = news[0];
	else {
		ctx.reply('non ci sono news');
		return;
	}
	news = News.load(news);
	ctx.reply(news.show());
});

bot.hears(/aggiungi trasferta\n[\s\S]*/gim, async ctx => {
	const trasferta = Trasferta.parse(ctx.message);
	await trasferta.save(ctx.from.id);
	ctx.reply('Trasferta aggiunta');
});

bot.hears(/trasferte/i, async ctx => {
	ctx.reply('Queste sono le trasferte in arrivo: ');
	const trasferte = await Trasferta.getTrasferte();
	ctx.reply(Trasferta.show(trasferte));
});

bot.command('alltrasferte', async ctx => {
	ctx.reply("Queste sono tutte le trasferte dell'anno");
	const trasferte = await Trasferta.getAllTrasferte();
	ctx.reply(Trasferta.show(trasferte));
});

bot.hears('test', ctx => {
	const keyboard = Markup.keyboard(['/simple', 'test', '/pyramid'])
		.oneTime()
		.resize()
		.extra();
	ctx.reply('One time keyboard', keyboard);
});

bot.startPolling();
