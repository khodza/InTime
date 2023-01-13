const Bookclient = require('../modules/bookclientModule');
const handler = require('./handler');

exports.addBookclient = handler.createOne(Bookclient);
exports.getAllBookclients = handler.getAll(Bookclient, {
  _id: { $exists: true },
});
exports.getBookclient = handler.getOne(Bookclient);
exports.deleteBookclient = handler.deleteOne(Bookclient);
