const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },

        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },

        type: {
            type: String,
            required: true,
            trim: true,
        },

        title: {
            type: String,
            required: true,
            trim: true,
        },

        message: {
            type: String,
            required: true,
        },

        status: {
            type: String,
            enum: ['PENDING', 'SENT', 'FAILED'],
            default: 'PENDING',
        },

        read: {
            type: Boolean,
            default: false,
        },

        metadata: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },
    },
    {
        timestamps: true,
    },
);

notificationSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
