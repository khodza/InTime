const { Composer, Markup } = require('telegraf');
const Bookclient = require('../../modules/bookclientModule');
const Paidclient = require('../../modules/paidModule');

const bot = require('../core/bot');

const { makePrivate } = require('./makePrivate');

const {
  getAllRegClients,
  getLast24,
  getLastWeek,
  getLastMonth,
} = require('../lib/getAllRegClients');

const composer = new Composer();

composer.command('royhatdan_otilganlar', async (ctx) => {
  if (!makePrivate(ctx)) return;

  ctx.replyWithHTML(
    `Saytdan ro'yhatdan o'tkanlarni malumotlarini olishni yo'lini tanlang`,

    Markup.inlineKeyboard([
      [
        Markup.button.callback(
          `๐๐ 24 soat  ichida ro'yhatdan o'tkanlar`,
          'last24hours'
        ),
      ],
      [
        Markup.button.callback(
          `๐โคด๏ธ O'tkan hafta ichida ro'yhatdan o'tkanlar`,
          'lastweek'
        ),
      ],
      [
        Markup.button.callback(
          `๐๐ O'tkan oy ichida ro'yhatdan o'tkanlar`,
          'lastmonth'
        ),
      ],
      [
        Markup.button.callback(
          `๐ Barcha ro'yhatdan o'tkanlar (excel)`,
          'allregistred'
        ),
      ],
    ])
  );
});

composer.on(`callback_query`, async (ctx) => {
  const callbackData = ctx.callbackQuery.data;

  if (callbackData.startsWith('allregistred')) {
    await getAllRegClients(ctx, Bookclient);
  } else if (callbackData.startsWith('last24hours')) {
    await getLast24(ctx, Bookclient);
  } else if (callbackData.startsWith('lastweek')) {
    await getLastWeek(ctx, Bookclient);
  } else if (callbackData.startsWith('lastmonth')) {
    await getLastMonth(ctx, Bookclient);
  } else if (callbackData.startsWith('tolov_allregistred')) {
    await getAllRegClients(ctx, Paidclient);
  } else if (callbackData.startsWith('tolov_last24hours')) {
    await getLast24(ctx, Paidclient);
  } else if (callbackData.startsWith('tolov_lastweek')) {
    await getLastWeek(ctx, Paidclient);
  } else if (callbackData.startsWith('tolov_lastmonth')) {
    await getLastMonth(ctx, Paidclient);
  }
});

bot.use(composer.middleware());
