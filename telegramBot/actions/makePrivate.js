const bot = require('../core/bot');

module.exports.makePrivate = function (ctx) {
  const admins = process.env.BOT_ADMINS.split('/').map((el) => +el);
  const admin = +process.env.ADMIN;
  if (admins.includes(ctx.chat.id) || ctx.chat.id === admin) {
    return true;
  }
  bot.telegram.sendMessage(
    ctx.chat.id,
    `🔒Hurmatli foydalanuvchi (${ctx.chat.id}) siz admin emassiz , iltimos adminlar bilan bog'laning ! @Khodza_I`,
    {}
  );
  return false;
};
