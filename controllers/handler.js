const catchAsync = require('../utils/catchAsync');
const Features = require('../utils/features');
const getMaxPage = require('../utils/maxPage');
const AppError = require('../utils/appError');

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    // if (
    //   !req.body.clientNumber.startsWith('+998') ||
    //   req.body.clientNumber.length !== 11
    // ) {
    //   next(new AppError(`To'g'ri raqam kiriting`, 400));
    // }
    const doc = await Model.create(req.body);

    res.status(200).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });

exports.getAll = (Model, matchParam) =>
  catchAsync(async (req, res, next) => {
    const features = new Features(Model.find(), req.query)
      .filter()
      .sort()
      .limitField()
      .paginate();

    let queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    queryObj = JSON.parse(queryStr);
    if (Object.keys(queryObj).length !== 0) {
      // eslint-disable-next-line no-param-reassign
      matchParam = { ...matchParam, ...queryObj };
    }
    const doc = await features.query;
    const maxPage = await getMaxPage(Model, matchParam, req);
    res.status(200).json({
      status: 'success',
      maxPage,
      result: doc.length,
      data: {
        doc,
      },
    });
  });

exports.getOne = (Model) =>
  catchAsync(async (req, res, next) => {
    // TODO
    // Should add popOptions for comments ,products, reviews
    const doc = await Model.findById(req.params.id);
    if (!doc) {
      return next(new AppError('Bu ID lik dakument topilmadi!', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError('Bu ID lik dakument topilmadi!'));
    }
    res.status(204).json({
      status: 'deleted',
      data: null,
    });
  });
