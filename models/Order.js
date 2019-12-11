const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const Order = new mongoose.Schema({
  userId: { type: ObjectId, required: true },
  fullName: { type: String, required: false },
  phone: { type: Number, required: false },
  address: {
    zipCode: { type: Number, required: false },
    city: { type: String, required: false },
    addressLine: { type: String, required: false }
  },
  isCompleted: { type: Boolean, default: false }
});

module.exports = mongoose.model('Order', Order);
