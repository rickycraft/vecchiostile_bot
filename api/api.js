const Telegraf = require('telegraf');
const bot = new Telegraf(process.env.BOT_TOKEN);
bot.context.modder = false;

const Telegram = require('telegraf/telegram');
const telegram = new Telegram(process.env.BOT_TOKEN);

const Markup = require('telegraf/markup');
const Extra = require('telegraf/extra');

function keyboard(arr) {
	return Markup.keyboard(arr)
		.oneTime()
		.resize()
		.extra();
}

module.exports = {
	telegram: telegram,
	bot: bot,
	Markup: Markup,
	Extra: Extra,
	keyboard: keyboard,
};
