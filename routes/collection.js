const express = require('express');
const router = express.Router();

/* GET collection listing. */
router.get('/', (req, res, next) => res.send('This is the route for collection.'));

module.exports = router;
