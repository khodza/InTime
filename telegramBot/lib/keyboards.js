const { Markup } = require('telegraf');

const keyboards = {
  start: Markup.inlineKeyboard([
    Markup.button.callback(`Kamandalarni ko'rish uchun bosing 🫵🏼`, 'commands'),
  ]),
};
module.exports = keyboards;
