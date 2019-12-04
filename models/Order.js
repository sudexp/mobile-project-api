const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const Order = new mongoose.Schema({
  userId: { type: ObjectId, required: true },
  fullName: { type: String, required: true },
  address: {
    zipCode: { type: Number, required: true },
    city: { type: String, required: true },
    addressLine: { type: String, required: true }
  },
  isCompleted: { type: Boolean }
});

module.exports = mongoose.model('Order', Order);
