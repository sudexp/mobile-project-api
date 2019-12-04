const mongoose = require('mongoose');

const Item = new mongoose.Schema({
  brand: { type: String, required: true },
  price: { type: Number, required: true },
  color: { type: String, default: '' },
  material: { type: String, default: '' },
  closure_method: { type: String, default: '' },
  description: { type: String, default: '' },
  image: { type: String, default: '' }
});

module.exports = mongoose.model('Item', Item);
