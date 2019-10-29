const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  model: { type: String, required: true, max: 50 },
  price: { type: Number, required: true },
  color: { type: String },
  material: { type: String },
  closure_method: { type: String },
  description: { type: String }
});

// virtual for items's URL
ItemSchema.virtual('url').get(function() {
  return '/collection/item/' + this._id;
});

// export model
module.exports = mongoose.model('Item', ItemSchema);
