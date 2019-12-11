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
  },

  delete: params => {
    return new Promise((resolve, reject) => {
      console.log(`[delete] itemID=${params.orderItemId}`)
      // hash PW
      OrderItem.deleteOne({ _id: params.orderItemId })
        .then(data => {
          if (data.deletedCount !== 1) {
            reject(new Error(`Was not able to remove item ${params.orderItemId} from DB`));
            return;
          }
          resolve(data);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
};
