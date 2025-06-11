// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { bulkProcess, getAllItems } = require('../controllers/itemController');

router.post('/bulk', protect, bulkProcess);
router.get('/', protect, getAllItems);

module.exports = router;