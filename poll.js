const API = require('./classes/api');
const Users = require('./classes/user');
const db = require('./database/db');

const rgx = require('./classes/regex');
const add_pool = `inserisci sondaggio${rgx.s}(${rgx.body}+)${rgx.n}(${rgx.body}{2,})`;

API.bot.hears(rgx.build(add_pool), async (ctx, next) => {
	const flag = await User.isModder(ctx.from.id);
	if (!flag) return next();

	const question = ctx.match[1];
	const options = ctx.match[2].split(rgx.build(rgx.s));

	const msg = await ctx.replyWithPoll(question, options);
	const poll_id = msg.message_id;

	await Poll.insert(poll_id, question);
});

API.bot.hears(/chiudi sondaggio/i, async (ctx, next) => {
	const flag = await User.isModder(ctx.from.id);
	if (!flag) return next();

	const poll = await Poll.latest();
	if (poll) {
		const msg = await ctx.stopPoll(poll.poll_id);
		await Poll.update(poll._id, msg.options);
	} else ctx.reply('non ci sono sondaggi aperti');
});

API.bot.hears(/pubblica sondaggio/i, async (ctx, next) => {
	const flag = await User.isModder(ctx.from.id);
	if (!flag) return next();

	const poll = await Poll.latest();
	if (poll) {
		const users = await Users.all();
		users.map(user => {
			API.telegram.forwardMessage(
				user.user_id,
				ctx.from.id,
				poll.poll_id
			);
		});
	} else ctx.reply('non ci sono sondaggi aperti');
});

class Poll {
	static insert(id, question) {
		return db.insert({
			poll_id: id,
			question: question,
			date: new Date(),
		});
	}

	static async latest() {
		const polls = await db
			.find({ poll_id: { $exists: true }, options: { $exists: false } })
			.sort({ date: -1 })
			.limit(1);
		if (polls.length > 0) return polls[0];
		else return null;
	}

	static async removeLatest() {
		const poll = await this.latest();
		if (poll) return db.remove({ poll });
		else return 0;
	}

	static update(id, options) {
		return db.update({ _id: id }, { $set: { options: options } });
	}
}

module.exports = Poll;
