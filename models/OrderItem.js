const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const OrderItem = new mongoose.Schema({
  orderId: { type: ObjectId, required: true },
  itemId: { type: ObjectId, required: true },
  size: { type: Number, required: true },
  quantity: { type: Number, required: true }
});

module.exports = mongoose.model('OrderItem', OrderItem);
