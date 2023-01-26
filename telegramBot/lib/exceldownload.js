const XLSX = require('xlsx');
const path = require('path');

module.exports.downloadExcel = async (
  Model,
  ctx,
  matchOpt,
  sortOpt,
  fileName
) => {
  ctx.telegram.sendChatAction(ctx.chat.id, 'upload_document');
  const wb = XLSX.utils.book_new();
  const clients = await Model.aggregate([
    { $match: matchOpt },
    { $sort: sortOpt },
    { $project: { _id: 0, id: 0, __v: 0 } },
  ]);

  let temp = JSON.stringify(clients);
  temp = JSON.parse(temp);
  const ws = XLSX.utils.json_to_sheet(temp);
  const down = path.join(__dirname, `../../data/excel/${fileName}`);
  XLSX.utils.book_append_sheet(wb, ws, 'sheet1');
  XLSX.writeFile(wb, down);
  ctx.telegram.sendDocument(ctx.chat.id, {
    source: `${__dirname}/../../data/excel/${fileName}`,
  });
  ctx.answerCbQuery();
};
