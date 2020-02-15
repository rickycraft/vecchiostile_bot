const API = require('./api');
const User = require('../database/user');
const Photo = require('../database/photo');
const messages = require('../common/messages');

API.bot.hears(/cancella foto/i, async ctx => {
	if (!ctx.modder) return ctx.reply(messages.no_auth);

	const removed = await Photo.removeLatest();
	if (removed > 0) ctx.reply('foto cancellata');
	else ctx.reply('foto non cancellata');
});

API.bot.hears(/ultima foto/i, async ctx => {
	const photo = await Photo.latest();
	ctx.replyWithPhoto(photo.photo_id);
});

const insertPhoto = async ctx => {
	if (!ctx.modder) return ctx.reply(messages.no_auth);

	const photo_id = ctx.message.photo[0].file_id;
	await Photo.insert(photo_id);
	ctx.reply('foto salvata con successo');
};

const commands = ['cancella foto', 'ultima foto'];

module.exports = {
	insertPhoto: insertPhoto,
	commands: commands,
};
