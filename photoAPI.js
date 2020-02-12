const API = require('./bot');
const Photo = require('./photo');
const User = require('./user');
const messages = require('./messages');

const insertPhoto = async ctx => {
	const flag = await User.isModder(ctx.from.id);
	if (!flag) return ctx.reply(messages.no_valid);

	const photo_id = ctx.message.photo[0].file_id;
	await Photo.insert(photo_id);
	ctx.reply('foto salvata con successo');
};

API.bot.hears(/cancella foto/i, async ctx => {
	const flag = await User.isModder(ctx.from.id);
	if (!flag) return ctx.reply(messages.no_valid);

	const removed = await Photo.removeLatest();
	if (removed > 0) ctx.reply('foto cancellata');
	else ctx.reply('foto non cancellata');
});

API.bot.hears(/pubblica foto/i, async ctx => {
	const photo = await Photo.latest();
	ctx.replyWithPhoto(photo.photo_id);
});

module.exports = {
	insertPhoto: insertPhoto,
	commands: ['cancella foto', 'pubblica foto'],
};
