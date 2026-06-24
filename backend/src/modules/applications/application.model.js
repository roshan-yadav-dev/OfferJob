const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Job',
            required: true,
        },

        resumeUrl: {
            type: String,
            required: true,
        },

        status: {
            type: String,
            enum: ['applied', 'shortlisted', 'rejected'],
            default: 'applied',
        },

        aiScore: {
            type: Number,
            default: null,
        },

        interviewDetails: {
            type: {
                interviewDate: String,
                interviewTime: String,
                interviewLocation: String,
                notes: String,
                invitedAt: Date,
            },
            default: null,
        },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('Application', applicationSchema);
