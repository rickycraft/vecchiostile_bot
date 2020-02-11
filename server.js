require('dotenv').config();

// telegraf
const API = require('./bot');
const bot = API.bot;

// database
const delay = require('delay');

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

// NEWS

bot.hears(/inserisci news\n[\s\S]*/gim, async ctx => {
	const flag = await User.isModder(ctx.from.id);
	if (!flag) return;

	await News.parse(ctx.message);

	const keyboard = API.getKeyboard([
		['pubblica news', 'pubblica news foto'],
		['cancella news'],
	]);
	ctx.reply(messages.added_news, keyboard);
});

bot.hears(/cancella news/i, async ctx => {
	const flag = await User.isModder(ctx.from.id);
	if (!flag) return;

	const num = await News.removeLatest();

	if (num > 0) ctx.reply('news cancellata');
	else ctx.reply('news non cancellata');
});

bot.hears(/^(pubblica news foto)/i, async ctx => {
	News.public(ctx.from.id, true);
});

bot.hears(/^(pubblica news)/i, async ctx => {
	News.public(ctx.from.id);
});

// TRASFERTA

bot.hears(/^inserisci trasferta\n[\s\S]*/i, async ctx => {
	await Trasferta.insert(ctx.message);

	const keyboard = API.getKeyboard([
		['pubblica trasferta', 'pubblica trasferta foto'],
		['cancella trasferta'],
	]);
	ctx.reply('trasferta aggiunta', keyboard);
});

bot.hears(/^(pubblica trasferte foto)/i, ctx => {
	Trasferta.public(ctx.from.id, true);
});

bot.hears(/^(pubblica trasferte)/i, ctx => {
	Trasferta.public(ctx.from.id);
});

bot.hears(/^cancella trasferta/i, async ctx => {
	await Trasferta.removeLatest();
	ctx.reply('trasferta cancellata con successo');
});

bot.hears(/^trasferte\s*(\d)?/i, async ctx => {
	ctx.reply(messages.upcomig_trasferte);
	await delay(500);

	const limit = ctx.match[1] ? ctx.match[1] : 1;
	const trasferte = await Trasferta.upcoming(limit);

	const msg = trasferte.reduce(
		(acc, val) => acc + Trasferta.show(val) + '\n#####\n',
		''
	);
	ctx.reply(msg);
});

bot.command('alltrasferte', async ctx => {
	ctx.reply(messages.all_trasferte);

	const trasferte = await Trasferta.all();
	const msg = trasferte.reduce(
		(acc, val) => acc + Trasferta.show(val) + '\n#####\n',
		''
	);

	ctx.reply(msg);
});

// PHOTO

async function onPhoto(ctx) {
	const photo_id = ctx.message.photo[0].file_id;
	await Photo.insert(photo_id);
	ctx.reply('foto salvata con successo');
}

bot.hears(/cancella foto/i, async ctx => {
	const flag = await User.isModder(ctx.from.id);
	if (!flag) return;

	await Photo.removeLatest();
	ctx.reply('foto rimossa con successo');
});

bot.hears(/pubblica foto/i, async ctx => {
	const photo = await Photo.latest();
	ctx.replyWithPhoto(photo.photo_id);
});

bot.hears('test', async ctx => {
	console.log('test');
});

bot.startPolling();
