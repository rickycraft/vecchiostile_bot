const API = require('../classes/api');
const User = require('../classes/user');
const messages = require('../classes/messages');
const News = require('./news');

const keyboard = API.keyboard([
	['pubblica news', 'pubblica news foto'],
	['cancella news'],
]);

const rgx = require('../classes/regex');
const insert_news = rgx.build(`inserisci news${rgx.s}(${rgx.body}+)`);

API.bot.hears(insert_news, async (ctx, next) => {
	const flag = await User.isModder(ctx.from.id);
	if (!flag) return next();

	const news = await News.parse(ctx.match);
	const msg = messages.added_news + news.news_body;
	const extra = API.Extra.HTML().load(keyboard);

	ctx.reply(msg, extra);
});

API.bot.hears(/inserisci news/, async (ctx, next) => {
	const flag = await User.isModder(ctx.from.id);
	if (!flag) return next();

	ctx.reply("controlla l'input");
});

API.bot.hears(/cancella news/i, async ctx => {
	const flag = await User.isModder(ctx.from.id);
	if (!flag) return ctx.reply(messages.no_valid);

	const removed = await News.removeLatest();

	if (removed > 0) ctx.reply('news cancellata con successo');
	else ctx.reply('news non cancellata');
});

API.bot.hears(/^(pubblica news foto)/i, async ctx => {
	public(ctx.from.id, true);
});

API.bot.hears(/^(pubblica news)/i, async ctx => {
	public(ctx.from.id);
});

API.bot.hears(/^(ultima news\s*)/i, async ctx => {
	const news = await News.latest();
	const msg = messages.latest_news + news.news_body;

	ctx.reply(msg, API.Extra.HTML());
});

public = async (id, isphoto) => {
	const flag = await User.isModder(id);
	if (!flag) return API.telegram.sendMessage(id, messages.no_valid);

	const news = await News.latest();
	let msg = messages.news + news.news_body;

	if (news) await User.public(msg, isphoto);
	else telegram.sendMessage(id, 'non ci sono news da pubblicare');
};

const commands = [
	'inserisci news',
	'cancella news',
	'pubblica news',
	'pubblica news foto',
];

module.exports = { commands: commands };
