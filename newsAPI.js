const API = require('./bot');
const News = require('./news');
const User = require('./user');
const messages = require('./messages');

const keyboard = API.keyboard([
	['pubblica news', 'pubblica news foto'],
	['cancella news'],
]);

API.bot.hears(/inserisci news\n[\s\S]*/gim, async ctx => {
	const flag = await User.isModder(ctx.from.id);
	if (!flag) return ctx.reply(messages.no_valid);

	await News.parse(ctx.message);

	ctx.reply(messages.added_news, keyboard);
});

API.bot.hears(/cancella news/i, async ctx => {
	const flag = await User.isModder(ctx.from.id);
	if (!flag) return ctx.reply(messages.no_valid);

	const removed = await News.removeLatest();

	if (removed > 0) ctx.reply('news cancellata');
	else ctx.reply('news non cancellata');
});

API.bot.hears(/^(pubblica news foto)/i, async ctx => {
	public(ctx.from.id, true);
});

API.bot.hears(/^(pubblica news)/i, async ctx => {
	public(ctx.from.id);
});

public = async (id, isphoto) => {
	const flag = await User.isModder(id);
	if (!flag) return API.telegram.sendMessage(id, messages.no_valid);

	const news = await News.latest();
	let msg = messages.news + news.news_body;

	if (news) await User.public(msg, isphoto);
	else telegram.sendMessage(id, 'non ci sono news');
};

const commands = [
	'inserisci news',
	'cancella news',
	'pubblica news',
	'pubblica news foto',
];

module.exports = { commands: commands };
