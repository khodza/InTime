// eslint-disable-next-line import/no-extraneous-dependencies
const { Composer } = require('telegraf');

const composer = new Composer();
const bot = require('../core/bot');
const keyboards = require('../lib/keyboards');
const messages = require('../lib/messages');
const makePrivate = require('./makePrivate');

composer.start((ctx) => {
  if (!makePrivate.makePrivate(ctx)) return;
  ctx.replyWithHTML(
    `Hurmatli ${ctx.message.from.first_name}😊\n\n<b>📊InTime ADMIN🕹</b> paneliga hush kelibsiz\n`,
    keyboards.start
  );
});

composer.help((ctx) => {
  if (!makePrivate.makePrivate(ctx)) return;
  ctx.replyWithHTML(
    `Ushbu bot <i><b>asadbekashurov.uz</b></i> saytining Admin🕹 paneli\n\n<b>Botni ishlatish uchun</b> /start  <b>kamandasidan foydalaning</b>`
  );
});

composer.action('commands', (ctx) => {
  ctx.editMessageText(messages.commands, {
    parse_mode: 'HTML',
  });
});

bot.use(composer.middleware());
