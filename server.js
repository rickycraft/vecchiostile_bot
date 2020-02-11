require('dotenv').config();

// telegraf
const Telegraf = require('telegraf');
const bot = new Telegraf(process.env.BOT_TOKEN);
const Markup = require('telegraf/markup');

// database
const db = require('./db');
const fetch = require('node-fetch');

const messages = require('./messages');

// Classes
const Trasferta = require('./trasferta');
const User = require('./user');
const News = require('./news');
const Photo = require('./photo');

bot.start(async ctx => {
	await User.addUser(ctx.from.id, ctx.from.username);
	ctx.reply(messages.welcome);
});

bot.use((ctx, next) => {
	if (ctx.updateType == 'message') {
		if (ctx.updateSubTypes == 'photo') onPhoto(ctx);
		else next();
	} else next();
});

bot.hears(/inserisci news\n[\s\S]*/gim, async ctx => {
	const news = News.parse(ctx.message);
	await news.save();
	const keyboard = Markup.keyboard([['pubblica news'], ['cancella news']])
		.oneTime()
		.resize()
		.extra();
	ctx.reply(messages.added_news, keyboard);
});

bot.hears(/^(pubblica news foto)/i, async ctx => {
	const news = await News.latest();
	const photo = await Photo.latest();
	ctx.reply(news.show());
	ctx.replyWithPhoto(photo.photo_id);
});

bot.hears(/^(pubblica news)/i, async ctx => {
	const news = await News.latest();
	ctx.reply(news.show());
});

bot.hears(/cancella news/i, async ctx => {
	const news = await News.latest();
	await news.delete();
	ctx.reply('news cancellata');
});

bot.hears(/^aggiungi trasferta\n[\s\S]*/i, async ctx => {
	const trasferta = Trasferta.parse(ctx.message);
	await trasferta.save();
	ctx.reply('trasferta aggiunta');
});

bot.hears(/^cancella trasferta/i, async ctx => {
	await Trasferta.deleteTrasferta();
	ctx.reply('trasferta cancellata con successo');
});

// TODO add photo to trasferte
bot.hears(/^trasferte\s*(\d)?/i, async ctx => {
	ctx.reply(messages.upcomig_trasferte);

	const limit = ctx.match[1] ? ctx.match[1] : 1;
	const trasferte = await Trasferta.getTrasferte(limit);

	ctx.reply(Trasferta.show(trasferte));
});

bot.command('alltrasferte', async ctx => {
	ctx.reply(messages.all_trasferte);
	const trasferte = await Trasferta.getAllTrasferte();
	ctx.reply(Trasferta.show(trasferte));
});

bot.hears('test', ctx => {});

bot.on('message', async ctx => {
	/*
	console.log(ctx.message.photo);
	console.log(ctx.message.photo[0].file_id);
	// console.log(ctx.updateSubTypes);
	const file_id = ctx.message.photo[0].file_id;
	
	const image_url = await fetch(
		process.env.GET_FILE_URL.concat(file_id)
	).then(res => res.json());
	console.log(image_url);
	*/
});

async function onPhoto(ctx) {
	console.log('photo');
	const photo_id = ctx.message.photo[0].file_id;
	const photo = new Photo(photo_id);
	await photo.save();
	ctx.reply('foto salvata con successo');
}

bot.startPolling();
