require('dotenv').config();

// telegraf
const API = require('./classes/api');
const bot = API.bot;

// Classes
const User = require('./classes/user');
const messages = require('./classes/messages');
const unknown = require('./classes/unknown');

bot.catch((err, ctx) => {
	console.log(`ERROR ${ctx.updateType}`, err);
});

bot.start(async ctx => {
	await User.addUser(ctx.from.id, ctx.from.username);
	ctx.reply(messages.welcome);
});

// PHOTO
const photo = require('./photo/photoAPI');

bot.use((ctx, next) => {
	if (ctx.updateType == 'message' && ctx.updateSubTypes == 'photo')
		photo.insertPhoto(ctx);
	else next();
});

// TRASFERTE
const trasferte = require('./trasferta/trasfertaAPI');

// NEWS
const news = require('./news/newsAPI');

// HELP
bot.help(async ctx => {
	const flag = await User.isModder(ctx.from.id);
	let msg = 'COMANDI\n';
	if (flag) {
		msg = photo.commands
			.reduce((acc, val) => acc + '\n' + val, msg)
			.concat('\n#####');
		msg = trasferte.commands
			.reduce((acc, val) => acc + '\n' + val, msg)
			.concat('\n#####');
		msg = news.commands
			.reduce((acc, val) => acc + '\n' + val, msg)
			.concat('\n\nUTENTE\n');
	}
	msg +=
		'\nvedere la prossima trasferta: <b>trasferte</b>\n' +
		'vedere le prossime n trasferte: <b>trasferte n</b>\n' +
		"vedere tutte le trasferte dell'anno: <b>trasferte 0</b>\n" +
		"vedere l'ultima news: <b>ultima news</b>";

	ctx.reply(msg, API.Extra.HTML());
});

bot.command('template', async ctx => {
	const flag = await User.isModder(ctx.from.id);
	if (!flag) return ctx.reply(messages.no_valid);

	let msg =
		'inserisci trasferta\n' +
		'20/2/21 10:20\n' +
		'dove\n' +
		'messaggio\n' +
		'#####\n';
	msg += 'inserisci news\n' + 'messaggio\n';
	ctx.reply(msg);
});

// TEST
const admin_id = 216608019;

API.bot.on('poll', ctx => console.log('Poll update', ctx.poll));
API.bot.on('poll_answer', ctx => console.log('Poll answer', ctx.pollAnswer));

require('./poll');
const regex = require('./classes/regex');

bot.hears('test', async (ctx, next) => {
	if (ctx.from.id != admin_id) return next();

	const msg1 = await ctx.replyWithPoll('poll di prova', ['val 1', 'val 2']);
	console.log(msg1);

	const msg = await API.telegram.stopPoll(216608019, msg1.message_id);
	//await ctx.replyWithPoll('poll di prova', ['val 1', 'val 2']);
	console.log(msg);
});

bot.command('unknown', async (ctx, next) => {
	if (ctx.from.id != admin_id) return next();
	const commands = await unknown.all();
	console.log(commands);
	let msg = 'Comandi non conosciuti:\n';
	msg = commands.reduce((acc, val) => acc + val.command + '\n', msg);
	ctx.reply(msg);
});

bot.command('clear', async (ctx, next) => {
	if (ctx.from.id != admin_id) return next();
	await unknown.clear();
	ctx.reply('cleared commands');
});

bot.on('message', async ctx => {
	console.log(ctx.message.text);
	ctx.reply(messages.no_valid);
	await unknown.insert(ctx.message.text);
});

bot.startPolling();
