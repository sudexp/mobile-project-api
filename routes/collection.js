const express = require('express');
const router = express.Router();

// Require controller modules.
const itemController = require('../controllers/itemController');

// GET catalog home page.
router.get('/', itemController.itemList);

// GET request for one item.
router.get('/:id', itemController.itemDetail);

module.exports = router;
