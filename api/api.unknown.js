const API = require('./api');
const Unknown = require('../common/unknown');
const messages = require('../common/messages');

const admin_id = 216608019;

API.bot.command('unknown', async ctx => {
	if (ctx.from.id != admin_id) return;

	const commands = await Unknown.all();

	let msg = '';
	if (commands.length > 0) {
		console.log(commands);
		msg = commands.reduce(
			(acc, val) => acc + val.command + '\n',
			'Comandi non conosciuti:\n'
		);
	} else msg = 'Non ci sono comandi';

	ctx.reply(msg);
});

API.bot.command('clear', async ctx => {
	if (ctx.from.id != admin_id) return;

	await Unknown.clear();
	ctx.reply('cleared commands');
});

API.bot.on('message', async ctx => {
	console.log(ctx.message.text);
	ctx.reply(messages.no_valid);
	await Unknown.insert(ctx.message.text);
});

module.exports = {};
