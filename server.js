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

//TODO pubblica foto e basta, tastiere, help template

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
		msg = news.commands.reduce((acc, val) => acc + '\n' + val, msg);
	} else {
		msg +=
			'vedere la prossima trasferta: trasferte\n' +
			'vedere le prossime n trasferte: trasferte n\n' +
			"vedere tutte le trasferte dell'anno: trasferte 0";
	}
	ctx.reply(msg);
});

bot.command('template', async ctx => {
	const flag = await User.isModder(ctx.from.id);
	if (!flag) return ctx.reply(messages.no_valid);

	let msg =
		'inserisci trasferta\n' +
		'-/-/- -:-\n' +
		'dove\n' +
		'messaggio\n' +
		'#####\n';
	msg += 'inserisci news\n' + 'messaggio\n';
	ctx.reply(msg);
});

// TEST
bot.hears('test', async ctx => {
	const flag = ctx.message ? true : false;
	console.log(flag);
});

bot.on('message', ctx => {
	ctx.reply(messages.no_valid);
});

bot.startPolling();
