const { Composer, Markup } = require('telegraf');

const bot = require('../core/bot');

const Bookclient = require('../../modules/bookclientModule');

const composer = new Composer();
const { downloadExcel } = require('./exceldownload');

function getAllRegClients(ctx) {
  downloadExcel(
    Bookclient,
    ctx,
    {
      _id: { $exists: true },
    },
    { addedAt: -1 },
    'Barcha-royhatdan-otkanlar.xlsx'
  );
}

function getLast24(ctx) {
  downloadExcel(
    Bookclient,
    ctx,
    {
      addedAt: {
        $gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
    },
    { addedAt: -1 },
    '24-Soat-ichida-royhatdan-otkanlar.xlsx'
  );
}

function getLastWeek(ctx) {
  downloadExcel(
    Bookclient,
    ctx,
    {
      addedAt: {
        $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
    },
    { addedAt: -1 },
    'Otkan-hafta-royhatdan-otkanlar.xlsx'
  );
}
bot.use(composer.middleware());
module.exports = {
  getAllRegClients,
  getLast24,
  getLastWeek,
};
