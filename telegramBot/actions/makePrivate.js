const bot = require('../core/bot');

module.exports.makePrivate = function (ctx) {
  if (process.env.BOT_ADMINS.includes(ctx.chat.id)) {
    return true;
  }
  bot.telegram.sendMessage(
    ctx.chat.id,
    `🔒Hurmatli foydalanuvchi (${ctx.chat.id}) siz admin emassiz , iltimos adminlar bilan bog'laning ! @Khodza_I`,
    {}
  );
  return false;
};
