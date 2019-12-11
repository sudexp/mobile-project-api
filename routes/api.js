const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const controllers = require('../controllers');

router.use(authMiddleware);

// GET /api
router.get('/', (req, res) => {
  res.json({
    confirmation: 'success',
    data: 'API ROUTE'
  });
});

// GET /api/collection || /api/orders || /api/users
router.get('/:resource', (req, res) => {
  const resource = req.params.resource;
  const controller = controllers[resource];
  const filters = req.query;
  console.log('[api.js] filters = ', filters);
  console.log('[api.js] req.userId = ', req.userId);

  if (controller == null || resource === 'items') {
    res.json({
      confirmation: 'fail',
      message: 'Invalid Resource'
    });

    return;
  }

  // E.g. order controller should add userId to the filters to fetch orders.
  // we have access to req.userId
  if (resource === 'orders') {
    console.log(`[/orders] added userId=${req.userId} to filters.`);
    filters.userId = req.userId;
    console.log('[filters]: ', filters)
  }
  controller
    .get(filters)
    .then(data => {
      res.json({
        confirmation: 'success',
        data: data
      });
    })
    .catch(err => {
      res.json({
        confirmation: 'fail',
        message: err.message
      });
    });
});

// GET /api/collection/:id || /api/orders/:id || /api/users/:id
router.get('/:resource/:id', (req, res) => {
  const resource = req.params.resource;
  const id = req.params.id;
  const controller = controllers[resource];

  if (controller == null) {
    res.json({
      confirmation: 'fail',
      message: 'Invalid Resource'
    });

    return;
  }

  controller
    .getById(id)
    .then(data => {
      res.json({
        confirmation: 'success',
        data: data
      });
    })
    .catch(err => {
      res.json({
        confirmation: 'fail',
        message: err.message
      });
    });
});

// GET /api/orders/:order_id/items
router.get('/orders/:orderId/items', (req, res) => {
  const orderId = req.params.orderId;
  const controller = controllers.items;
  // const filters = { orderId: orderId };
  console.log(orderId);

  controller
    .get({ orderId })
    .then(data => {
      res.json({
        confirmation: 'success',
        data: data
      });
    })
    .catch(err => {
      res.json({
        confirmation: 'fail',
        message: err.message
      });
    });
});

// GET /api/orders/:orderId/items/:id
router.get('/orders/:orderId/items/:id', (req, res) => {
  const orderId = req.params.orderId;
  const id = req.params.id;
  const controller = controllers.items;

  controller
    .getById(id)
    .then(data => {
      if (data.orderId != orderId) {
        // wrong order id
        res.json({
          confirmation: 'fail',
          message: 'Invalid Resource'
        });
        return;
      }
      res.json({
        confirmation: 'success',
        data: data
      });
    })
    .catch(err => {
      res.json({
        confirmation: 'fail',
        message: err.message
      });
    });
});

// postRequest
const postRequest = (controller, res, postData) => {
  return makeRequest('post', controller, res, postData)
}

// deleteRequest
const deleteRequest = (controller, res, postData) => {
  return makeRequest('delete', controller, res, postData)
}

const makeRequest = (method, controller, res, postData) => {
  controller[method](postData)
    .then(data => {
      res.json({
        confirmation: 'success',
        data: data
      });
    })
    .catch(err => {
      res.json({
        confirmation: 'fail',
        message: err.message
      });
    });
}

// POST /api/auth
router.post('/auth', (req, res) => {
  const controller = controllers.auth;

  controller
    .auth(req.body)
    .then(data => {
      res.json({
        confirmation: 'success',
        data: data
      });
    })
    .catch(err => {
      res.json({
        confirmation: 'fail',
        message: err.message
      });
    });
});

// POST /api/orders?token=12345
// body: { name: "admin", address: "Jyvaskyla" }
router.post('/orders', (req, res) => {
  const controller = controllers.orders;
  // token -> userId
  // { name: "Dima", address: "Jyvaskyla", userId: "abc123" }
  const postData = {
    ...req.body,
    userId: req.userId
  };
  postRequest(controller, res, postData);
});

// POST /api/orders/:orderid?token=12345 - to complete token
// body: { isCompleted: true, phone, address }
router.post('/orders/:orderId', (req, res) => {
  const controller = controllers.orders;
  const postData = {
    orderDetails: req.body,
    orderId: req.params.orderId
  };
  postRequest(controller, res, postData);
});

// POST /api/orders/:orderId/items?token=12345
router.post('/orders/:orderId/items', (req, res) => {
  const controller = controllers.items;
  postRequest(controller, res, req.body);
});

// DELETE /api/orders/:orderId/items?token=12345
router.delete('/orders/:orderId/items/:orderItemId', (req, res) => {
  const controller = controllers.items;
  deleteRequest(controller, res, req.params);
});

module.exports = router;
