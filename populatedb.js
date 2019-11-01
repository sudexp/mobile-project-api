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

const Item = require('./models/Item');
const Order = require('./models/Order');
const OrderItem = require('./models/OrderItem');

const mongoose = require('mongoose');
const mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Items:
const itemCreate = itemDetails => {
  const item = new Item(itemDetails);

  return item.save();
};

const createItems = () => {
  const items = [
    {
      brand: 'Ecco Aurora',
      price: 100,
      color: 'Blue',
      material: 'Canvas',
      closure_method: 'Laces',
      description:
        'Meet the ultimate Sunday sneaker. Its slip-on design and cushioned sole makes it perfect for relaxed days at home or on the go. Wear them with sweats, jeans, or anything, really. They are about to become your most versatile shoe.'
    },
    {
      brand: 'Bugatti Tazzio',
      price: 115,
      color: 'Silver',
      material: 'Leather',
      closure_method: 'Laces',
      description:
        'For a sneaker to join your lineup, it’s got to offer something groundbreaking. This lightweight sneaker’s elevated style will have you steady stepping without the sluggish bulk.'
    },
    {
      brand: 'Zenden Casual',
      price: 60,
      color: 'Blue',
      material: 'Synthetic material / textile',
      closure_method: 'Laces',
      description:
        'This neutral running shoe orthotic friendly and available in multiple widths. In this neutral running shoe, you will be flying from your first step to your last.'
    },
    {
      brand: 'Clarks Weaver',
      price: 75,
      color: 'Brown',
      material: 'Suede leather',
      closure_method: 'Laces',
      description:
        'A slip-resistant outsole keeps you safe on the jobsite, and the premium full-grain leather cleans up for the office.'
    },
    {
      brand: 'Marwell Lace-Up',
      price: 80,
      color: 'Gray',
      material: 'Textile',
      closure_method: 'Laces',
      description:
        'This waterproof mens athletic shoe is slip and oil resistant with a rubber outsole. Featuring a non - metallic ASTM rated composite toe with leather and breathable mesh upper, the Eastfield is the perfect shoe for any off-the-bike activity.'
    }
  ];

  return Promise.all(items.map(itemDetails => itemCreate(itemDetails)));
};

// Orders:
const orderCreate = orderDetails => {
  const order = new Order(orderDetails);

  return order.save();
};

const createOrders = () => {
  const orders = [
    { name: 'admin', address: '40100, Jyväskylä, Piippukatu, 2', isCompleted: true },
    { name: 'user', address: '40430, Jyväskylä, Karpalokuja, 4', isCompleted: false }
  ];

  return Promise.all(orders.map(orderDetails => orderCreate(orderDetails)));
};

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

main().catch(err => console.log(err));
