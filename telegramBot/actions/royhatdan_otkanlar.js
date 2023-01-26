const { Composer, Markup } = require('telegraf');

const bot = require('../core/bot');

const { makePrivate } = require('./makePrivate');

const {
  getAllRegClients,
  getLast24,
  getLastWeek,
} = require('../lib/getAllRegClients');

const composer = new Composer();

composer.command('royhatdan_otilganlar', async (ctx) => {
  if (!makePrivate(ctx)) return;

  ctx.replyWithHTML(
    `Saytdan ro'yhatdan o'tkanlarni malumotlarini olishni yo'lini tanlang`,

    Markup.inlineKeyboard([
      [
        Markup.button.callback(
          `🕐 24 soat  ichida ro'yhatdan o'tkanlar`,
          'last24hours'
        ),
      ],
      [
        Markup.button.callback(
          `🕓⤴️ O'tkan hafta ichida ro'yhatdan o'tkanlar`,
          'lastweek'
        ),
      ],
      [
        Markup.button.callback(
          `📗 Barcha ro'yhatdan o'tkanlar (excel)`,
          'allregistred'
        ),
      ],
    ])
  );
});

composer.on(`callback_query`, async (ctx) => {
  const callbackData = ctx.callbackQuery.data;

  if (callbackData.startsWith('allregistred')) {
    await getAllRegClients(ctx);
  } else if (callbackData.startsWith('last24hours')) {
    await getLast24(ctx);
  } else if (callbackData.startsWith('lastweek')) {
    await getLastWeek(ctx);
  }
});

bot.use(composer.middleware());
