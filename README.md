## REST API for Online Store

This project is part of the [Online Store](https://github.com/sudexp/mobile-project) mobile version project.  

The purpose of this project is to develop a REST API using the following technologies:  

- [NodeJS](https://nodejs.org/en/) as an open-source server environment  
- [ExpressJS](https://expressjs.com/) as Node.js web application framework  
- [MongoDB](https://www.mongodb.com/) as a database  
- [MongooseJS](https://mongoosejs.com/) as a MongoDB object modeling tool designed to work in an asynchronous environment.  

**To run project:**  

- download or clone it  
- run *npm install* in command line  
- run *nodemon* (or *npm run devstart* if you do not have [nodemon](https://www.npmjs.com/package/nodemon) installed globally) in command line   
- open [localhost:3000](http://localhost:3000/api/)* in browser.  

**Basic information shortly**  

The database is deployed on the free cloud service [MongoDB Atlas](https://www.mongodb.com/cloud). Connection to the database requires login and password, which are specified in *config/local.json*. For security reasons, this file is included in the *.gitignore* list.  

The models compiled from the descriptions of the corresponding Mongoose Schemas are located in the *models* folder. For example, model [Item.js](models/item.js) is based on a Mongoose Schema that contains the following mandatory properties:  
```
// Item.js
brand: { type: String, required: true },
price: { type: Number, required: true },
color: { type: String, default: '' },
material: { type: String, default: '' },
closure_method: { type: String, default: '' },
description: { type: String, default: '' }
image: { type: String, default: '' }
```

Similarly, such models as [Order.js](models/Order.js), [OrderItem.js](models/OrderItem.js), [User.js](models/User.js) are also used in the project. After saving the model in *MongoDB*, a Document is created with the same properties as those defined in the scheme based on which the model was created.  

For database populating on server is used script [populate.js](populatedb.js). This script is launched by calling from the command line with the command *node populatedb*. The script is arranged in such a way that before filling the database with new data, the old data is completely cleared automatically.  

One of the most important part of REST API is to create routes for handling frontend requests. Main route is defined in the main project file [app.js](app.js):  
```
// app.js
const api = require('./routes/api');
app.use('/api/', api);
```

All other routes include */api/* string and are presented below.  

*GET routes:*  
- */api/collection* - to get a collection of items  
- */api/orders* - to get orders  
- */api/users* - to get users  

- */api/collection/:id* - to get a particular item from collection  
- */api/orders/:id* - to get a particular order  
- */api/users/:id* - to get a particular user  

- */api/orders/:orderId/items* - to get all items belonging to a particular order  
- */api/orders/:orderId/items/:id* - to get a particular item from order items  

*Note:* it is also possible to perform GET request using query filters, for example:
- */api/collection?color=Blue*  - to get all the items with the blue color  

*POST routes:*  
- */api/auth* - login (auth) route  
- */api/orders* - to create orders  
- */api/orders/:orderId* - to complete order  
- */api/orders/:orderId/items* - to create items for the given order  

*Note:* POST requests are tested with using [Postman](https://www.getpostman.com/).

*DELETE routes:*
- */api/orders/:orderId/items/:orderItemId* - to delete item from order  

The entire routing logic is closely related to the corresponding controller files, which handle incoming HTTP requests and send back to the client some result of the handling. These files are located in the [controllers](controllers) folder: [AuthController.js](controllers/AuthController.js), [ItemController.js](controllers/ItemController.js), [OrderController.js](controllers/OrderController.js), [OrderItemController.js](controllers/OrderItemController.js) and [UserController.js](controllers/UserController.js).  

User authorization logic is implemented in [AuthController.js](controllers/AuthController.js) as follows: if the user enters a name and password that are available in the database, the controller generate token, save it to database and send it to user attach it to the user:  
```
// AuthController.js
auth: params => {
  return new Promise((resolve, reject) => {
    User.find({ name: params.name, password: params.password })
      .then(data => {
        if (!data || !data.length) {
          reject({ message: 'Invalid credentials!' });

          return;
        }
        // data can be either {_id: ...} or [{_id: ...}]
        const user = (data._id && data) || data[0];
        const token = Math.random();

        User.updateOne({ _id: user._id }, { token }).then(() => {
          resolve({ token });
        });
      })
      .catch(err => {
        reject(err);
      });
  });
}
```

All HTTP requests, except *api/auth*, */api/users* and derivatives from */api/collection*, require user authorization. For example, */api/orders?token={random_number}*. This is implemented by using [authMiddleware.js](middlewares/authMiddleware.js):  
```
// api.js
router.use(authMiddleware);
```

```
// authMiddleware.js
const authMiddleware = (req, res, next) => {
  const token = req.query.token;
  const allowWithoutToken =
    req.path === '/users' ||
    req.path === '/auth' ||
    req.path.search('collection') !== -1;
  if (allowWithoutToken) {
    next();
    return;
  }

  if (!token) {
    res.json({ error: 'Token is required!' });
    return;
  }

  validateToken(token, res, req, next);
};
```

REST API functionality **is more clearly demonstrated** in mobile project [documentation](https://github.com/sudexp/mobile-project/blob/master/README.md).
