const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const OrderItem = new mongoose.Schema({
  orderId: { type: ObjectId, required: true },
  itemId: { type: ObjectId, required: true }, // item id in collection
  size: { type: Number, required: false },
  quantity: { type: Number, required: false }
});

module.exports = mongoose.model('OrderItem', OrderItem);
