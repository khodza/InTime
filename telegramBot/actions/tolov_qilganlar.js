const { Composer, Markup } = require('telegraf');
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

composer.command('tolov_qilganlar', async (ctx) => {
  if (!makePrivate(ctx)) return;

  ctx.replyWithHTML(
    `Saytdan to'lov qilganlarni malumotlarini olishni yo'lini tanlang`,

    Markup.inlineKeyboard([
      [
        Markup.button.callback(
          `🕐🌃 24 soat  ichida to'lov qilganlar`,
          'tolov_last24hours'
        ),
      ],
      [
        Markup.button.callback(
          `🕓⤴️ O'tkan hafta ichida to'lov qilganlar`,
          'tolov_lastweek'
        ),
      ],
      [
        Markup.button.callback(
          `🕓🌙 O'tkan oy ichida to'lov qilganlar`,
          'tolov_lastmonth'
        ),
      ],
      [
        Markup.button.callback(
          `📗 Barcha to'lov qilganlar (excel)`,
          'tolov_allregistred'
        ),
      ],
    ])
  );
});

composer.on(`callback_query`, async (ctx) => {
  const callbackData = ctx.callbackQuery.data;

  if (callbackData.startsWith('tolov_allregistred')) {
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
