const API = require('./bot');
const News = require('./news');
const User = require('./user');
const messages = require('./messages');

const keyboard = API.keyboard([
	['pubblica news', 'pubblica news foto'],
	['cancella news'],
]);

API.bot.hears(/inserisci news\s*\n[\s\S]*/i, async ctx => {
	const flag = await User.isModder(ctx.from.id);
	if (!flag) return ctx.reply(messages.no_valid);

	const news = await News.parse(ctx.message);
	const msg = messages.added_news + '\n' + news.news_body;
	const extra = API.Extra.HTML().load(keyboard);

	ctx.reply(msg, extra);
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
