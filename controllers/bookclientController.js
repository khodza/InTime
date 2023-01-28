const multer = require('multer');
const path = require('path');
const Bookclient = require('../modules/bookclientModule');
const catchAsync = require('../utils/catchAsync');
const bot = require('../telegramBot/core/bot');
const AppError = require('../utils/appError');
const PaidClient = require('../modules/paidModule');

const admins = process.env.BOT_ADMINS.split('/');
const { ADMIN } = process.env;

exports.addBookclient = catchAsync(async (req, res, next) => {
  const doc = await Bookclient.create(req.body);
  res.status(200).json({
    status: 'success',
    data: {
      doc,
    },
  });
  next();
});
exports.sendMessageReg = catchAsync(async (req, res, next) => {
  await bot.telegram.sendMessage(
    ADMIN,
    `<b>📌 Yangi klient saytdan ro'yhatdan o'tdi</b>\n\n👤 <i>Klient</i> :   <b>${req.body.klient}</b>\n\n☎️ <i>Telefon raqami</i> :   <code>${req.body.tel_raqam}</code>\n\n🕓 <i>Voqti</i> :  ${req.body.voqti} `,
    { parse_mode: 'HTML' }
  );
  admins.forEach(async (admin) => {
    try {
      await bot.telegram.sendMessage(
        admin,
        `<b>📌 Yangi klient saytdan ro'yhatdan o'tdi</b>\n\n👤 <i>Klient</i> :   <b>${req.body.klient}</b>\n\n☎️ <i>Telefon raqami</i> :   <code>${req.body.tel_raqam}</code>\n\n🕓 <i>Voqti</i> :  ${req.body.voqti} `,
        { parse_mode: 'HTML' }
      );
    } catch (err) {
      bot.telegram.sendMessage(
        process.env.ADMIN,
        `💥💥💥 ERROR 💥💥💥  \n\n${JSON.stringify(err)}`
      );
    }
  });
});

exports.addPayedclient = catchAsync(async (req, res, next) => {
  if (!req.file) {
    next(new AppError(`Chek rasimini joylang!`, 400));
  }
  const doc = await PaidClient.create(req.body);
  req.id = doc.id;
  res.status(200).json({
    status: 'success',
    data: {
      doc,
    },
  });
  next();
});

exports.sendMessagePayment = catchAsync(async (req, res, next) => {
  const msg = await bot.telegram.sendDocument(
    ADMIN,
    {
      source: path.join(
        __dirname,
        '../data/images',
        `chek.${req.file.mimetype.split('/')[1]}`
      ),
    },
    {
      caption: `<b>\n\n✅Kitob sotildi va to'lov💸 amalga oshirildi</b>\n\n👤 <i>Klient</i> :   <b>${req.body.klient}</b>\n\n☎️ <i>Telefon raqami</i> :   <code>${req.body.tel_raqam}</code>\n\n<i>📬 Telegram Username</i> :   ${req.body.userName}\n\n🕓 <i>Voqti</i> :  ${req.body.voqti} `,
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
          caption: `<b>\n\n✅Kitob sotildi va to'lov💸 amalga oshirildi</b>\n\n👤 <i>Klient</i> :   <b>${req.body.klient}</b>\n\n☎️ <i>Telefon raqami</i> :   <code>${req.body.tel_raqam}</code>\n\n<i>📬 Telegram Username</i> :   ${req.body.userName}\n\n🕓 <i>Voqti</i> :  ${req.body.voqti} `,
          parse_mode: 'HTML',
        }
      );
    } catch (err) {
      await bot.telegram.sendMessage(ADMIN, JSON.stringify(err));
    }
  });
  await PaidClient.findByIdAndUpdate(req.id, {
    file: msg.document.file_id,
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
