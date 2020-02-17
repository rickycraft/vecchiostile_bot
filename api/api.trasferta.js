const API = require('./api');
const User = require('../database/user');
const Trasferta = require('../database/trasferta');
const common = require('../common/common');
const messages = require('../common/messages');
const rgx = require('../common/regex');

const keyboard = API.keyboard([
	['pubblica trasferta', 'pubblica trasferta foto'],
	['cancella trasferta'],
]);
const insert_trasferta = rgx.build(
	`inserisci trasferta${rgx.s}(${rgx.date} ${rgx.time})${rgx.s}(${rgx.single_word})${rgx.s}(${rgx.body}+)`
);

API.bot.hears(insert_trasferta, async (ctx, next) => {
	if (!ctx.modder) return next();

	const trasferta = await Trasferta.insert(ctx.match);
	const msg = messages.added_trasferta + Trasferta.show(trasferta);
	const extra = API.Extra.HTML().load(keyboard);

	ctx.reply(msg, extra);
});

API.bot.hears(/inserisci trasferta/, async ctx => {
	if (!ctx.modder) return ctx.reply(messages.no_auth);
	ctx.reply(messages.check_input);
});

API.bot.hears(/cancella trasferta/i, async ctx => {
	if (!ctx.modder) return ctx.reply(messages.no_auth);

	const removed = await Trasferta.remove();

	if (removed > 0) ctx.reply('Trasferta cancellata');
	else ctx.reply('Trasferta non cancellata');
});

API.bot.hears(/pubblica trasferta foto\s*/i, ctx => {
	if (!ctx.modder) return ctx.reply(messages.no_auth);
	public(ctx.from.id, true);
});

API.bot.hears(/pubblica trasferta\s*/i, ctx => {
	if (!ctx.modder) return ctx.reply(messages.no_auth);
	public(ctx.from.id);
});

API.bot.hears(/trasferte\s*(\d)?/i, async ctx => {
	const limit = ctx.match[1] ? ctx.match[1] : 1;
	// se trasferta è 0 mostrale tutte
	let trasferte = limit == 0 ? Trasferta.all() : Trasferta.upcoming(limit);
	trasferte = await trasferte;
	let msg;
	if (trasferte.length > 0)
		msg = trasferte.reduce(
			(acc, val) => acc + Trasferta.show(val) + '\n',
			messages.upcomig_trasferte
		);
	else msg = messages.no_trasferte;
	ctx.reply(msg, API.Extra.HTML());
});

API.bot.command('prossima_trasferta', async ctx => {
	const trasferta = await Trasferta.upcoming(1);
	if (trasferta.length == 1) {
		const msg = Trasferta.show(trasferta[0]);
		ctx.reply(msg, API.Extra.HTML());
	} else ctx.reply(messages.no_trasferte);
});

const public = async (id, isphoto) => {
	const trasferta = await Trasferta.upcoming(1);

	if (trasferta.length == 1) {
		const msg = messages.next_trasferta + Trasferta.show(trasferta[0]);
		await common.public(msg, isphoto);
	} else API.telegram.sendMessage(id, 'non ci sono trasferte da pubblicare');
};

const commands = [
	'inserisci trasferta',
	'cancella trasferta',
	'pubblica trasferta',
	'pubblica trasferta foto',
];

module.exports = { commands: commands };
