const Notification = require('./notification.model');

const getMyNotifications = async (userId, options = {}) => {
    const { limit = 50, skip = 0 } = options;

    const [notifications, total] = await Promise.all([
        Notification.find({ userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select('-message')
            .lean(),
        Notification.countDocuments({ userId }),
    ]);

    return { notifications, total };
};

const getNotificationById = async (userId, notificationId) => {
    return Notification.findOne({
        _id: notificationId,
        userId,
    }).lean();
};

const markNotificationAsRead = async (userId, notificationId) => {
    const notification = await Notification.findOneAndUpdate(
        {
            _id: notificationId,
            userId,
        },
        { read: true },
        { new: true },
    ).select('-message');

    return notification;
};

module.exports = {
    getMyNotifications,
    getNotificationById,
    markNotificationAsRead,
};
