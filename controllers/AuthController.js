const User = require('../models/User');

module.exports = {
  auth: params => {
    return new Promise((resolve, reject) => {
      User.find({ name: params.name, password: params.password })
        .then(data => {
          console.log(data);
          // generate token, save it to database and send it to user
          if (!data || !data.length) {
            reject({ message: 'Invalid credentials!' });

            return;
          }
          // data can be either {_id: ...} or [{_id: ...}]
          const user = (data._id && data) || data[0];
          const token = Math.random(); // npm package?!

          User.updateOne({ _id: user._id }, { token }).then(() => {
            console.log(`Saved token for ${user._id}`);
            resolve({ token });
          });
        })
        .catch(err => {
          reject(err);
        });
    });
  }
};
