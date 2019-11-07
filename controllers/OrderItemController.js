const OrderItem = require('../models/OrderItem');

module.exports = {
  get: params => {
    return new Promise((resolve, reject) => {
      OrderItem.find(params)
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
      OrderItem.findById(id)
        .then(data => {
          resolve(data);
        })
        .catch(() => {
          reject(new Error('OrderItem ' + id + ' not found'));
        });
    });
  },

  post: params => {
    return new Promise((resolve, reject) => {
      // hash PW
      OrderItem.create(params)
        .then(data => {
          resolve(data);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
};
