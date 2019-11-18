const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const Order = new mongoose.Schema({
  userId: { type: ObjectId, required: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  isCompleted: { type: Boolean }
});

module.exports = mongoose.model('Order', Order);
