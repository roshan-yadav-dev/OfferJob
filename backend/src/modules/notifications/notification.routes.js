const express = require('express');

const protect = require('../../middleware/authMiddleware');
const {
    getMyNotificationsController,
    getNotificationByIdController,
    markNotificationReadController,
} = require('./notification.controller');

const router = express.Router();

router.use(protect);

router.get('/my', getMyNotificationsController);
router.get('/:id', getNotificationByIdController);
router.patch('/:id/read', markNotificationReadController);

module.exports = router;
