#! /usr/bin/env node

// const process = require('process');
const mongoose = require('mongoose');
const Item = require('./models/Item');
const Order = require('./models/Order');
const OrderItem = require('./models/OrderItem');
const User = require('./models/User');
const items = require('./seeds/items');
const orders = require('./seeds/orders');
const users = require('./seeds/users');

/* Get arguments passed on command line
const userArgs = process.argv.slice(2);
const mongoDB = userArgs[0]; */

const config = require('config');
const mongoDB = config.get('dbConfig.dbConnection');
console.log(`mongoDB = ${mongoDB}`);

/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/

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
  db.dropCollection('users', err => {
    err ? console.log('error delete collection users') : console.log('delete collection users success');
  });
});
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;

// Items:
const itemCreate = itemDetails => {
  const item = new Item(itemDetails);

  return item.save();
};

const createItems = () => Promise.all(items.map(itemDetails => itemCreate(itemDetails)));

// Orders:
const orderCreate = async orderDetails => {
  // get 1st user and get its _id. Then use this as `userId` for creating an order
  const users = await User.find({});
  const userId = users[0]._id;

  const order = new Order({
    ...orderDetails,
    userId
  });

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

// Users:
const userCreate = userDetails => {
  const user = new User(userDetails);

  return user.save();
};

const createUsers = () => Promise.all(users.map(userDetails => userCreate(userDetails)));

const main = async () => {
  const items = await createItems();
  console.log('items: ', items);

  const users = await createUsers();
  console.log('users: ', users);

  const orders = await createOrders();
  console.log('orders: ', orders);

  const orderItems = await createOrderItems();
  console.log('orderItems: ', orderItems);

  mongoose.connection.close();
};

main().catch(err => {
  console.log(err), mongoose.connection.close();
});
