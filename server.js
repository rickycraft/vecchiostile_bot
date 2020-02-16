require('dotenv').config();

// telegraf
const API = require('./api/api');
const bot = API.bot;

// Classes
const User = require('./database/user');
const messages = require('./common/messages');
const help = require('./common/help');

bot.catch((err, ctx) => {
	console.log(`ERROR ${ctx.updateType}`, err);
});

bot.start(async ctx => {
	ctx.reply(messages.welcome, API.Extra.HTML());
	await User.addUser(ctx.from.id, ctx.from.username);
});

API.bot.on('poll', ctx => {
	//	console.log('Poll update', ctx.poll)
});
API.bot.on('poll_answer', ctx => {
	// 	console.log('Poll answer', ctx.pollAnswer);
});

bot.use(async (ctx, next) => {
	// console.log(ctx);
	if (ctx.updateType == 'message')
		ctx.modder = await User.isModder(ctx.from.id);
	next();
});

// PHOTO
const photo = require('./api/api.photo');

bot.use((ctx, next) => {
	if (ctx.updateType == 'message' && ctx.updateSubTypes == 'photo')
		photo.insertPhoto(ctx);
	else next();
});

// TRASFERTE
const trasferta = require('./api/api.trasferta');

// NEWS
const news = require('./api/api.news');

//POLL
const poll = require('./api/api.poll');

// HELP
bot.help(async ctx => {
	let msg = 'COMANDI\n';
	if (ctx.modder) {
		msg = help.add_help(msg, photo);
		msg = help.add_help(msg, trasferta);
		msg = help.add_help(msg, news);
		msg = help.add_help(msg, poll);
	}
	msg += help.user_help;

	ctx.reply(msg, API.Extra.HTML());
});

bot.command('template', async ctx => {
	if (ctx.modder) ctx.reply(help.template);
});

// TEST
const admin_id = 216608019;

bot.hears('test', async (ctx, next) => {
	if (ctx.from.id != admin_id) return;

	require('./database/poll').removeAll();
});

// LAST!!
require('./api/api.unknown');

bot.startPolling();
