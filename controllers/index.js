const ItemController = require('./ItemController');
const OrderController = require('./OrderController');
const OrderItemController = require('./OrderItemController');
const UserController = require('./UserController');
const AuthController = require('./AuthController');

module.exports = {
  collection: ItemController,
  orders: OrderController,
  items: OrderItemController,
  users: UserController,
  auth: AuthController
};
