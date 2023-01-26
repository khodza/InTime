const { Composer } = require('telegraf');
const Bookclient = require('../../modules/bookclientModule');

const bot = require('../core/bot');

const composer = new Composer();
const { downloadExcel } = require('./exceldownload');

function getAllRegClients(ctx, Model) {
  downloadExcel(
    Model,
    ctx,
    {
      _id: { $exists: true },
    },
    { addedAt: -1 },
    'Barcha-royhatdan-otkanlar.xlsx'
  );
}

function getLast24(ctx, Model) {
  downloadExcel(
    Model,
    ctx,
    {
      addedAt: {
        $gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
    },
    { addedAt: -1 },
    Model === Bookclient
      ? '24-Soat-ichida-royhatdan-otkanlar.xlsx'
      : '24-Soat-tolov-qilganlar-otkanlar.xlsx'
  );
}

function getLastWeek(ctx, Model) {
  downloadExcel(
    Model,
    ctx,
    {
      addedAt: {
        $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
    },
    { addedAt: -1 },
    Model === Bookclient
      ? 'Otkan-hafta-royhastdan-otkanlar.xlsx'
      : 'Otkan-hafta-tolov-qilganlar.xlsx'
  );
}
function getLastMonth(ctx, Model) {
  downloadExcel(
    Model,
    ctx,
    {
      addedAt: {
        $gte: new Date(Date.now() - 30 * 7 * 24 * 60 * 60 * 1000),
      },
    },
    { addedAt: -1 },
    Model === Bookclient
      ? 'Otkan-oy-royhatdan-otkanlar.xlsx'
      : 'Otkan-oy-tolov-qilganlar.xlsx'
  );
}
bot.use(composer.middleware());
module.exports = {
  getAllRegClients,
  getLast24,
  getLastWeek,
  getLastMonth,
};
