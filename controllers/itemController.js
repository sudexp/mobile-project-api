// const Item = require('../models/item');

// Display list of all items.
exports.itemList = (req, res) => res.send('Item list');

// Display detail page for a specific item.
exports.itemDetail = (req, res) => res.send('Item detail: ' + req.params.id);
