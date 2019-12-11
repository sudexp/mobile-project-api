const Order = require('../models/Order');

module.exports = {
  get: params => {
    return new Promise((resolve, reject) => {
      Order.find(params)
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
      Order.findById(id)
        .then(data => {
          resolve(data);
        })
        .catch(() => {
          reject(new Error('Order ' + id + ' not found'));
        });
    });
  },

  post: params => {
    return new Promise((resolve, reject) => {
      if (params.orderId) {
        Order.updateOne({ _id: params.orderId }, params.orderDetails)
          .then(data => {
            resolve(data);
          })
          .catch(err => {
            reject(err);
          });
        return;
      }
      // hash PW
      Order.create(params)
        .then(data => {
          resolve(data);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
};
