const API = require('./bot');
const messages = require('./messages');
const User = require('./user');
const Trasferta = require('./trasferta');

const keyboard = API.keyboard([
	['pubblica trasferta', 'pubblica trasferta foto'],
	['cancella trasferta'],
]);

API.bot.hears(/^inserisci trasferta\n[\s\S]*/i, async ctx => {
	const flag = await User.isModder(ctx.from.id);
	if (!flag) return ctx.reply(messages.no_valid);

	await Trasferta.insert(ctx.message);
	ctx.reply('trasferta aggiunta', keyboard);
});

API.bot.hears(/^cancella trasferta/i, async ctx => {
	const flag = await User.isModder(ctx.from.id);
	if (!flag) return ctx.reply(messages.no_valid);

	const removed = await Trasferta.removeLast();
	if (removed > 0) ctx.reply('trasferta cancellata');
	else ctx.reply('trasferta non cancellata');
});

API.bot.hears(/^(pubblica trasferta foto)/i, ctx => {
	public(ctx.from.id, true);
});

API.bot.hears(/^(pubblica trasferta)/i, ctx => {
	public(ctx.from.id);
});

API.bot.hears(/^trasferte\s*(\d)?/i, async ctx => {
	const limit = ctx.match[1] ? ctx.match[1] : 1;
	// se trasferta è 0 mostrale tutte
	let trasferte = limit == 0 ? Trasferta.all() : Trasferta.upcoming(limit);
	trasferte = await trasferte;

	const msg = trasferte.reduce(
		(acc, val) => acc + Trasferta.show(val) + '\n',
		messages.upcomig_trasferte
	);
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
