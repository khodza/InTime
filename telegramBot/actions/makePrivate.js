const bot = require('../core/bot');

module.exports.makePrivate = function (ctx) {
  const admins = process.env.BOT_ADMINS.split('/').map((el) => +el);
  if (admins.includes(ctx.chat.id)) {
    return true;
  }
  bot.telegram.sendMessage(
    ctx.chat.id,
    `🔒Hurmatli foydalanuvchi (${ctx.chat.id}) siz admin emassiz , iltimos adminlar bilan bog'laning ! @Khodza_I`,
    {}
  );
  return false;
};
