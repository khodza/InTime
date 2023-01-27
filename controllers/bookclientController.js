const multer = require('multer');
const path = require('path');
const Bookclient = require('../modules/bookclientModule');
const catchAsync = require('../utils/catchAsync');
const bot = require('../telegramBot/core/bot');
const AppError = require('../utils/appError');
const PaidClient = require('../modules/paidModule');

const admins = process.env.BOT_ADMINS.split('/').map((el) => +el);

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
  const msg = await bot.telegram.sendDocument(
    +process.env.ADMIN,
    {
      source: path.join(
        __dirname,
        '../data/images',
        `chek.${req.file.mimetype.split('/')[1]}`
      ),
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

  admins.forEach(async (admin) => {
    try {
      await bot.telegram.sendDocument(
        admin,
        {
          source: path.join(
            __dirname,
            '../data/images',
            `chek.${req.file.mimetype.split('/')[1]}`
          ),
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
    } catch (err) {
      await bot.telegram.sendMessage(+process.env.ADMIN, JSON.stringify(err));
    }
  });
  req.body.file = msg.document.file_id;
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
    const fileName = `chek.${file.mimetype.split('/')[1]}`;
    cb(null, fileName);
  },
});
const fileFilter = (req, file, cb) => {
  const whitelist = ['image/png', 'image/jpeg', 'image/jpg'];
  if (whitelist.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        'Faqat jpeg,jpg,png formatidagi rasmlar qabul qilinadi! ,iltimos rasm yuklang!',
        400
      ),
      false
    );
  }
};
exports.uploadPhoto = multer({
  storage: storageOnAdd,
  fileFilter,
  limits: { fileSize: 11534336 },
});

// exports.compressImage = function (req, res, next) {
//   const compressImagePath = path.join(
//     __dirname,
//     '../data/compressed',
//     `Chek.${req.file.mimetype.split('/')[1]}`
//   );
//   const image = sharp(
//     path.join(
//       __dirname,
//       '../data/images',
//       `check.${req.file.mimetype.split('/')[1]}`
//     )
//   );
//   const imageCom = image.jpeg({
//     quality: 20,
//   });
//   imageCom.toFile(compressImagePath, (err, info) => {
//     if (err) {
//       return new AppError('Compres qilishta error', 400);
//     }
//     console.log(info);
//     next();
//   });
// };
