const API = require('./classes/api');
const db = require('./database/db');

/*
API.bot.on('poll', ctx => console.log('Poll update', ctx.poll));
API.bot.on('poll_answer', ctx => console.log('Poll answer', ctx.pollAnswer));

API.bot.command('poll', ctx =>
	ctx.replyWithPoll(
		'Your favorite math constant',
		['x', 'e', 'π', 'φ', 'γ'],
		{ is_anonymous: false }
	)
);

API.bot.command('quiz', ctx =>
	ctx.replyWithQuiz('2b|!2b', ['True', 'False'], { correct_option_id: 0 })
);

*/
const rgx = require('./classes/regex');
const add_pool = `inserisci sondaggio${rgx.s}(${rgx.body}+)${rgx.n}(${rgx.body}{2,})`;

API.bot.hears(rgx.build(add_pool), async (ctx, next) => {
	const question = ctx.match[1];
	const options = ctx.match[2].split(rgx.build(rgx.s));

	const msg = await ctx.replyWithPoll(question, options);
	console.log(msg);

	const poll_id = msg.message_id;

	await Poll.insert(poll_id, question);
});

API.bot.hears(/chiudi sondaggio/i, async (ctx, next) => {
	const poll = await Poll.latest();
	if (poll) {
		const msg = await ctx.stopPoll(poll.poll_id);
		await Poll.update(poll._id, msg.options);
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
