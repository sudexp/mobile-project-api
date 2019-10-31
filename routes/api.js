const express = require('express');
const router = express.Router();
const controllers = require('../controllers');

// GET /api
router.get('/', (req, res) => {
  res.json({
    confirmation: 'success',
    data: 'API ROUTE'
  });
});

// GET /api/collection || /api/orders:
router.get('/:resource', (req, res) => {
  const resource = req.params.resource;
  const controller = controllers[resource];
  const filters = req.query;

  if (controller == null) {
    res.json({
      confirmation: 'fail',
      message: 'Invalid Resource'
    });
    return;
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

// GET /api/collection/:id || /api/orders/:id
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

// GET /api/orders/:orderId/items/:id
router.get('/:resource/:id/:resource/:id', (req, res) => {
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
router.post('/:resource/:id/:resourse', (req, res) => {
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

module.exports = router;
