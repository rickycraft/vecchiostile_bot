const token = "";
const Telegraf = require("telegraf");
const db = require("./db");

const bot = Telegraf(token);

// stuff
bot.start(ctx => {
  ctx.reply("Benvenuto nel vecchiostile Bot");
});

bot.help(ctx => ctx.reply("HEEELP!!"));

bot.hears(/trasferta (.+)/, async ctx => {
  const userId = ctx.from.id;
  const text = ctx.match[0];
});

bot.startPolling();
