// eslint-disable-next-line import/no-extraneous-dependencies, import/no-unresolved
const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.launch();
module.exports = bot;
