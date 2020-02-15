const API = require('./api');
const User = require('../database/user');
const Poll = require('../database/poll');
const rgx = require('../common/regex');

const add_pool = rgx.build(
	`inserisci sondaggio${rgx.s}(${rgx.body}+)${rgx.n}(${rgx.body}{2,})`
);

API.bot.hears(add_pool, async ctx => {
	if (!ctx.modder) return ctx.reply(messages.no_auth);

	const question = ctx.match[1];
	const options = ctx.match[2].split(rgx.build(rgx.s));

	const msg = await ctx.replyWithPoll(question, options);
	const poll_id = msg.message_id;

	await Poll.insert(poll_id, question);
});

API.bot.hears(/chiudi sondaggio/i, async ctx => {
	if (!ctx.modder) return ctx.reply(messages.no_auth);

	const poll = await Poll.latest();
	if (poll) {
		const msg = await ctx.stopPoll(poll.poll_id);
		await Poll.update(poll._id, msg.options);
		API.telegram.forwardMessage(ctx.from.id, ctx.from.id, poll.poll_id);
	} else ctx.reply('non ci sono sondaggi aperti');
});

API.bot.hears(/pubblica sondaggio/i, async ctx => {
	if (!ctx.modder) return ctx.reply(messages.no_auth);

	const poll = await Poll.latest();

	if (poll) {
		const users = await User.all();
		users.map(user => {
			API.telegram.forwardMessage(
				user.user_id,
				ctx.from.id,
				poll.poll_id
			);
		});
	} else ctx.reply('non ci sono sondaggi aperti');
});

const commands = [
	'inserisci sondaggio',
	'chiudi sondaggio',
	'pubblica sondaggio',
];

module.exports = { commands: commands };
