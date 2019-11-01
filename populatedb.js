#! /usr/bin/env node

console.log('Adding sample data into the database...');

const process = require('process');
// Get arguments passed on command line
const userArgs = process.argv.slice(2);

/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/

const mongoose = require('mongoose');
const db = mongoose.connection;
// drop collections before populate
db.once('open', () => {
  console.log('db connect');
  db.dropCollection('items', err => {
    err ? console.log('error delete collection items') : console.log('delete collection items success');
  });
  db.dropCollection('orders', err => {
    err ? console.log('error delete collection orders') : console.log('delete collection orders success');
  });
  db.dropCollection('orderitems', err => {
    err ? console.log('error delete collection orderItems') : console.log('delete collection orderItems success');
  });
});
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;

const Item = require('./models/Item');
const Order = require('./models/Order');
const OrderItem = require('./models/OrderItem');

const items = require('./seeds/items');
const orders = require('./seeds/orders');

// Items:
const itemCreate = itemDetails => {
  const item = new Item(itemDetails);

  return item.save();
};

const createItems = () => Promise.all(items.map(itemDetails => itemCreate(itemDetails)));

// Orders:
const orderCreate = orderDetails => {
  const order = new Order(orderDetails);

  return order.save();
};

const createOrders = () => Promise.all(orders.map(orderDetails => orderCreate(orderDetails)));

// OrderItems:
const orderItemCreate = orderItemDetails => {
  const orderItem = new OrderItem(orderItemDetails);

  return orderItem.save();
};

const createOrderItems = async () => {
  const orders = await Order.find({});
  const orderId = orders[0]._id;
  const items = await Item.find({});
  const itemId1 = items[0]._id;
  const itemId2 = items[1]._id;

  console.log(`orderId=${orderId}, itemId1=${itemId1}, itemId2=${itemId2}`);

  const orderItems = [
    { orderId: orderId, itemId: itemId1, size: 45, quantity: 1 },
    { orderId: orderId, itemId: itemId2, size: 39, quantity: 2 }
  ];

  return Promise.all(orderItems.map(orderItemsDetails => orderItemCreate(orderItemsDetails)));
};

const main = async () => {
  const items = await createItems();
  console.log('items: ', items);

  const orders = await createOrders();
  console.log('orders: ', orders);

  const orderItems = await createOrderItems();
  console.log('orderItems: ', orderItems);

  mongoose.connection.close();
};

main().catch(err => {
  console.log(err), mongoose.connection.close();
});
