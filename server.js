require('dotenv').config();

// telegraf
const API = require('./bot');
const bot = API.bot;

// Classes
const User = require('./user');
const messages = require('./messages');

bot.catch((err, ctx) => {
	console.log(`ERROR ${ctx.updateType}`, err);
});

bot.start(async ctx => {
	await User.addUser(ctx.from.id, ctx.from.username);
	ctx.reply(messages.welcome);
});

// PHOTO
const photo = require('./photoAPI');

bot.use((ctx, next) => {
	if (ctx.updateType == 'message' && ctx.updateSubTypes == 'photo')
		photo.insertPhoto(ctx);
	else next();
});

// TRASFERTE
const trasferte = require('./trasfertaAPI');

// NEWS
const news = require('./newsAPI');

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
			//			.concat('\n#####')
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
bot.hears('test', async ctx => {
	const keyboard = API.keyboard(['random']);
	const extra = API.Extra.HTML().load(keyboard);
	ctx.reply('<b>test1</b>', extra);
});

bot.on('message', ctx => {
	console.log(ctx.message.text);
	ctx.reply(messages.no_valid);
});

bot.startPolling();
