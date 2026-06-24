const mongoose = require('mongoose');

const asyncHandler = require('../../utils/asyncHandler');
const {
    getMyNotifications,
    getNotificationById,
    markNotificationAsRead,
} = require('./notification.service');

const getMyNotificationsController = asyncHandler(async (req, res) => {
    const limit = Math.min(parseInt(req.query.limit, 10) || 50, 100);
    const skip = parseInt(req.query.skip, 10) || 0;

    const { notifications, total } = await getMyNotifications(req.user._id, {
        limit,
        skip,
    });

    res.status(200).json({
        success: true,
        notifications,
        total,
        limit,
        skip,
    });
});

const getNotificationByIdController = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid notification ID',
        });
    }

    const notification = await getNotificationById(req.user._id, id);

    if (!notification) {
        return res.status(404).json({
            success: false,
            message: 'Notification not found',
        });
    }

    res.status(200).json({
        success: true,
        notification,
    });
});

const markNotificationReadController = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid notification ID',
        });
    }

    const notification = await markNotificationAsRead(req.user._id, id);

    if (!notification) {
        return res.status(404).json({
            success: false,
            message: 'Notification not found',
        });
    }

    res.status(200).json({
        success: true,
        message: 'Notification marked as read',
        notification,
    });
});

module.exports = {
    getMyNotificationsController,
    getNotificationByIdController,
    markNotificationReadController,
};
