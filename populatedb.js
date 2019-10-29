#! /usr/bin/env node

console.log('Addidng sample data into the database...');

const process = require('process');
// Get arguments passed on command line
const userArgs = process.argv.slice(2);

/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/

const async = require('async');
const Item = require('./models/item');

const mongoose = require('mongoose');
const mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const items = [];

const itemCreate = (model, price, color, material, closure_method, description, cb) => {
  const itemDetail = {
    model: model,
    price: price,
    color: color,
    material: material,
    closure_method: closure_method,
    description: description
  };

  const item = new Item(itemDetail);

  item.save(err => {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New item: ' + item);
    items.push(item);
    cb(null, item);
  });
};

const createItems = cb => {
  async.series(
    [
      callback =>
        itemCreate(
          'Ecco Aurora',
          100,
          'Blue',
          'Canvas',
          'Laces',
          'Meet the ultimate Sunday sneaker. Its slip-on design and cushioned sole makes it perfect for relaxed days at home or on the go. Wear them with sweats, jeans, or anything, really. They are about to become your most versatile shoe.',
          callback
        ),
      callback =>
        itemCreate(
          'Bugatti Tazzio',
          115,
          'Silver',
          'Leather',
          'Laces',
          'For a sneaker to join your lineup, it’s got to offer something groundbreaking. This lightweight sneaker’s elevated style will have you steady stepping without the sluggish bulk.',
          callback
        ),
      callback =>
        itemCreate(
          'Zenden Casual',
          60,
          'Blue',
          'Synthetic material / textile',
          'Laces',
          'This neutral running shoe orthotic friendly and available in multiple widths. In this neutral running shoe, you will be flying from your first step to your last.',
          callback
        ),
      callback =>
        itemCreate(
          'Clarks Weaver',
          75,
          'Brown',
          'Suede leather',
          'Laces',
          'A slip-resistant outsole keeps you safe on the jobsite, and the premium full-grain leather cleans up for the office.',
          callback
        ),
      callback =>
        itemCreate(
          'Marwell Lace-Up',
          80,
          'Gray',
          'Textile',
          'Laces',
          'This waterproof mens athletic shoe is slip and oil resistant with a rubber outsole.Featuring a non - metallic ASTM rated composite toe with leather and breathable mesh upper, the Eastfield is the perfect shoe for any off-the-bike activity.',
          callback
        )
    ],
    // optional callback
    cb
  );
};

async.series(
  [createItems],
  // Optional callback
  (err, results) => {
    if (err) {
      console.log('FINAL ERR: ' + err);
    } else {
      console.log('items: ' + items);
    }
    // All done, disconnect from database
    mongoose.connection.close();
  }
);
