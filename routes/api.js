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
  console.log(filters);

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

// GET /api/orders/{order_id}/items:
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

// POST /api/orders
router.post('/:resource', (req, res) => {
  const resource = req.params.resource;
  const controller = controllers[resource];

  if (controller == null) {
    res.json({
      confirmation: 'fail',
      message: 'Invalid Resource'
    });

    return;
  }

  controller
    .post(req.body)
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

// POST /api/orders/:orderId/items
router.post('/orders/:orderId/items', (req, res) => {
  const controller = controllers.items;

  controller
    .post(req.body)
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

module.exports = router;
