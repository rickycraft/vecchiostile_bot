const API = require('../classes/api');
const User = require('../classes/user');
const messages = require('../classes/messages');
const Trasferta = require('./trasferta');

const keyboard = API.keyboard([
	['pubblica trasferta', 'pubblica trasferta foto'],
	['cancella trasferta'],
]);
const rgx = require('../classes/regex');
const insert_trasferta = `inserisci trasferta${rgx.s}(${rgx.date} ${rgx.time})${rgx.s}(${rgx.single_word})${rgx.s}(${rgx.body}+)`;

API.bot.hears(rgx.build(insert_trasferta), async (ctx, next) => {
	const flag = await User.isModder(ctx.from.id);
	if (!flag) return next();

	const trasferta = await Trasferta.insert(ctx.match);
	const msg = messages.added_trasferta + Trasferta.show(trasferta);
	const extra = API.Extra.HTML().load(keyboard);

	ctx.reply(msg, extra);
});

API.bot.hears(/inserisci trasferta/, async (ctx, next) => {
	const flag = await User.isModder(ctx.from.id);
	if (!flag) return next();

	ctx.reply("controlla l'input");
});

API.bot.hears(/cancella trasferta/i, async ctx => {
	const flag = await User.isModder(ctx.from.id);
	if (!flag) return ctx.reply(messages.no_valid);

	const removed = await Trasferta.removeLast();
	if (removed > 0) ctx.reply('Trasferta cancellata');
	else ctx.reply('Trasferta non cancellata');
});

API.bot.hears(/pubblica trasferta foto\s*/i, ctx => {
	public(ctx.from.id, true);
});

API.bot.hears(/pubblica trasferta\s*$/i, ctx => {
	public(ctx.from.id);
});

API.bot.hears(/trasferte (\d)?\s*$/i, async ctx => {
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

const public = async (id, isphoto) => {
	const flag = await User.isModder(id);
	if (!flag) return API.telegram.sendMessage(id, messages.no_valid);

	const trasferta = await Trasferta.upcoming(1);

	if (trasferta.length == 1) {
		const msg = messages.next_trasferta + Trasferta.show(trasferta[0]);
		await User.public(msg, isphoto);
	} else API.telegram.sendMessage(id, 'non ci sono trasferte da pubblicare');
};

const commands = [
	'inserisci trasferta',
	'cancella trasferta',
	'pubblica trasferta',
	'pubblica trasferta foto',
];

module.exports = { commands: commands };
