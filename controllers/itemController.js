const Item = require('../models/Item');

module.exports = {
  get: params => {
    return new Promise((resolve, reject) => {
      Item.find(params)
        .then(data => {
          resolve(data);
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  getById: id => {
    return new Promise((resolve, reject) => {
      Item.findById(id)
        .then(data => {
          resolve(data);
        })
        .catch(() => {
          reject(new Error('Item ' + id + ' not found'));
        });
    });
  }
};
