const ItemController = require('./ItemController');
const OrderController = require('./OrderController');
const OrderItemController = require('./OrderItemController');
const UserController = require('./UserController');

module.exports = {
  collection: ItemController,
  orders: OrderController,
  items: OrderItemController,
  user: UserController
};
