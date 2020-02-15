const API = require('./api');
const User = require('../database/user');
const News = require('../database/news');
const common = require('../common/common');
const messages = require('../common/messages');
const rgx = require('../common/regex');

const keyboard = API.keyboard([
	['pubblica news', 'pubblica news foto'],
	['cancella news'],
]);
const insert_news = rgx.build(`inserisci news${rgx.s}(${rgx.body}+)`);

API.bot.hears(insert_news, async (ctx, next) => {
	if (!ctx.modder) return next();

	const news = await News.insert(ctx.match);
	const msg = messages.added_news + news.news_body;
	const extra = API.Extra.HTML().load(keyboard);

	ctx.reply(msg, extra);
});

API.bot.hears(/inserisci news/, async ctx => {
	if (!ctx.modder) return ctx.reply(messages.no_auth);

	ctx.reply(messages.check_input);
});

API.bot.hears(/cancella news/i, async ctx => {
	if (!ctx.modder) return ctx.reply(messages.no_auth);

	const removed = await News.removeLatest();

	if (removed > 0) ctx.reply('news cancellata con successo');
	else ctx.reply('news non cancellata');
});

API.bot.hears(/^(pubblica news foto)/i, async ctx => {
	if (ctx.modder) public(ctx.from.id, true);
	else ctx.reply(messages.no_auth);
});

API.bot.hears(/^(pubblica news)/i, async ctx => {
	if (ctx.modder) public(ctx.from.id);
	else ctx.reply(messages.no_auth);
});

API.bot.hears(/^(ultima news\s*)/i, async ctx => {
	const news = await News.latest();
	const msg = messages.latest_news + news.news_body;

	ctx.reply(msg, API.Extra.HTML());
});

public = async (id, isphoto) => {
	const news = await News.latest();
	const msg = messages.news + news.news_body;

	if (news) await common.public(msg, isphoto);
	else telegram.sendMessage(id, 'non ci sono news da pubblicare');
};

const commands = [
	'inserisci news',
	'cancella news',
	'pubblica news',
	'pubblica news foto',
];

module.exports = { commands: commands };
