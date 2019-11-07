const User = require('../models/User');

module.exports = {
  auth: params => {
    return new Promise((resolve, reject) => {
      User.find(params)
        .then(data => {
          console.log(data);
          // generate token, save it to database and send it to user
          if (!data.length) {
            reject({ message: 'Invalid credentials!' });

            return;
          }
          const token = Math.random(); // npm package?!

          User.updateOne({ _id: data._id }, { token }).then(() => {
            resolve({ token });
          });
        })
        .catch(err => {
          reject(err);
        });
    });
  }
};
