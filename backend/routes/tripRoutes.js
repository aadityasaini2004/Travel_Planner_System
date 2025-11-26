const express = require('express');
const { createTrip, getUserTrips } = require('../controllers/tripController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', protect, createTrip);
router.get('/', protect, getUserTrips);

module.exports = router;
