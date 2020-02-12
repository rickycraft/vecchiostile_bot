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

//TODO pubblica foto e basta, tastiere, help

// PHOTO
const onPhoto = require('./photoAPI');
bot.use((ctx, next) => {
	if (ctx.updateType == 'message' && ctx.updateSubTypes == 'photo')
		onPhoto(ctx);
	else next();
});

// TRASFERTE
require('./trasfertaAPI');

// NEWS
require('./newsAPI');

// TEST
bot.hears('test', async ctx => {
	const flag = ctx.message ? true : false;
	console.log(flag);
});

bot.on('message', ctx => {
	ctx.reply(messages.no_valid);
});

bot.startPolling();
