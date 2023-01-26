const multer = require('multer');
const path = require('path');
const Bookclient = require('../modules/bookclientModule');
const catchAsync = require('../utils/catchAsync');
const bot = require('../telegramBot/core/bot');
const AppError = require('../utils/appError');
const PaidClient = require('../modules/paidModule');

let admins = process.env.BOT_ADMINS.split('/').map((el) => +el);

exports.addBookclient = catchAsync(async (req, res, next) => {
  const doc = await Bookclient.create(req.body);
  admins.forEach((admin) => {
    bot.telegram.sendMessage(
      admin,
      `<b>📌 Yangi klient saytdan ro'yhatdan o'tdi</b>\n\n👤 <i>Klient</i> :   <b>${
        doc.klient
      }</b>\n\n☎️ <i>Telefon raqami</i> :   <code>${
        doc.tel_raqam
      }</code>\n\n🕓 <i>Voqti</i> :  ${doc.addedAt.toLocaleString()} `,
      { parse_mode: 'HTML' }
    );
  });

  res.status(200).json({
    status: 'success',
    data: {
      doc,
    },
  });
});

exports.addPayedclient = catchAsync(async (req, res, next) => {
  const msg = await bot.telegram.sendPhoto(
    admins[0],
    {
      source: path.join(__dirname, '../data/images/check.jpeg'),
    },
    {
      caption: `<b>\n\n✅Kitob sotildi va to'lov💸 amalga oshirildi</b>\n\n👤 <i>Klient</i> :   <b>${
        req.body.klient
      }</b>\n\n☎️ <i>Telefon raqami</i> :   <code>${
        req.body.tel_raqam
      }</code>\n\n<i>📬 Telegram Username</i> :   ${
        req.body.userName
      }\n\n🕓 <i>Voqti</i> :  ${new Date().toLocaleString()} `,
      parse_mode: 'HTML',
    }
  );

  admins = admins.slice(1);

  admins.forEach((admin) => {
    bot.telegram.sendPhoto(
      admin,
      {
        source: path.join(__dirname, '../data/images/check.jpeg'),
      },
      {
        caption: `<b>\n\n✅Kitob sotildi va to'lov💸 amalga oshirildi</b>\n\n👤 <i>Klient</i> :   <b>${
          req.body.klient
        }</b>\n\n☎️ <i>Telefon raqami</i> :   <code>${
          req.body.tel_raqam
        }</code>\n\n<i>📬 Telegram Username</i> :   ${
          req.body.userName
        }\n\n🕓 <i>Voqti</i> :  ${new Date().toLocaleString()} `,
        parse_mode: 'HTML',
      }
    );
  });

  req.body.file = msg.photo[0].file_id;
  const doc = await PaidClient.create(req.body);
  res.status(200).json({
    status: 'success',
    data: {
      doc,
    },
  });
});

const storageOnAdd = multer.diskStorage({
  destination(req, file, cb) {
    bot.telegram.sendChatAction(admins[0], 'upload_photo');
    cb(null, path.join(__dirname, '../data/images'));
  },
  filename(req, file, cb) {
    const fileName = `check.${file.mimetype.split('/')[1]}`;
    cb(null, fileName);
  },
});
const fileFilter = (req, file, cb) => {
  const whitelist = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
  if (whitelist.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new AppError('Faqat rasm qabul qilinadi ,iltimos rasm yuklang!', 400),
      false
    );
  }
};
exports.uploadPhoto = multer({
  storage: storageOnAdd,
  fileFilter,
  limits: { fileSize: 5242880 },
});
