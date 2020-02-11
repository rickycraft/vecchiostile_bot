const Telegraf = require('telegraf');
const bot = new Telegraf(process.env.BOT_TOKEN);
const Telegram = require('telegraf/telegram');
const telegram = new Telegram(process.env.BOT_TOKEN);
const Markup = require('telegraf/markup');

function getKeyboard(arr) {
	return Markup.keyboard(arr)
		.oneTime()
		.resize()
		.extra();
}

module.exports = {
	telegram: telegram,
	bot: bot,
	getKeyboard: getKeyboard,
};
